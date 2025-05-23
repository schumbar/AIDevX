import copy
import os
import sys
from collections import deque

from litellm import ChatCompletionToolParam, ModelResponse

import openhands.agenthub.codeact_agent.function_calling as codeact_function_calling
from openhands.agenthub.codeact_agent.tools.bash import create_cmd_run_tool
from openhands.agenthub.codeact_agent.tools.browser import BrowserTool
from openhands.agenthub.codeact_agent.tools.finish import FinishTool
from openhands.agenthub.codeact_agent.tools.ipython import IPythonTool
from openhands.agenthub.codeact_agent.tools.llm_based_edit import LLMBasedFileEditTool
from openhands.agenthub.codeact_agent.tools.str_replace_editor import (
    create_str_replace_editor_tool,
)
from openhands.agenthub.codeact_agent.tools.think import ThinkTool
from openhands.agenthub.codeact_agent.tools.web_read import WebReadTool
from openhands.controller.agent import Agent
from openhands.controller.state.state import State
from openhands.core.config import AgentConfig
from openhands.core.logger import openhands_logger as logger
from openhands.core.message import Message
from openhands.events.action import Action, AgentFinishAction, MessageAction
from openhands.events.event import Event, EventSource
from openhands.llm.llm import LLM
from openhands.memory.condenser import Condenser
from openhands.memory.condenser.condenser import Condensation, View
from openhands.memory.conversation_memory import ConversationMemory
from openhands.runtime.plugins import (
    AgentSkillsRequirement,
    JupyterRequirement,
    PluginRequirement,
)
from openhands.utils.prompt import PromptManager


class AIAgent(Agent):
    VERSION = '1.0'
    """
    The AI Agent is specialized for end-to-end ML pipelines.

    This agent is designed to handle the complete machine learning workflow from data understanding
    to model deployment, with a focus on automating the entire process.

    The agent can:
    1. Analyze datasets to understand their structure and content
    2. Perform data preparation and cleaning
    3. Create visualizations to explore data relationships
    4. Conduct feature engineering and selection
    5. Select appropriate models based on the data and task
    6. Train and evaluate models
    7. Deploy models for inference
    8. Generate comprehensive reports of the entire process

    It uses the same tools as the CodeAct agent but with specialized prompts for ML tasks.
    """

    sandbox_plugins = [
        JupyterRequirement(),
        AgentSkillsRequirement(),
    ]

    def __init__(
        self,
        llm: LLM,
        config: AgentConfig,
    ) -> None:
        """Initializes a new instance of the AIAgent class.

        Parameters:
        - llm (LLM): The llm to be used by this agent
        - config (AgentConfig): The configuration for this agent
        """
        super().__init__(llm, config)
        self.pending_actions: deque['Action'] = deque()
        self.reset()
        self.tools = self._get_tools()

        # Create a ConversationMemory instance
        self.conversation_memory = ConversationMemory(self.config, self.prompt_manager)

        self.condenser = Condenser.from_config(self.config.condenser)
        logger.debug(f'Using condenser: {type(self.condenser)}')

    @property
    def prompt_manager(self) -> PromptManager:
        if self._prompt_manager is None:
            self._prompt_manager = PromptManager(
                prompt_dir=os.path.join(os.path.dirname(__file__), 'prompts'),
            )

        return self._prompt_manager

    def _get_tools(self) -> list['ChatCompletionToolParam']:
        # For these models, we use short tool descriptions ( < 1024 tokens)
        # to avoid hitting the OpenAI token limit for tool descriptions.
        SHORT_TOOL_DESCRIPTION_LLM_SUBSTRS = ['gpt-', 'o3', 'o1', 'o4']

        use_short_tool_desc = False
        if self.llm is not None:
            use_short_tool_desc = any(
                model_substr in self.llm.config.model
                for model_substr in SHORT_TOOL_DESCRIPTION_LLM_SUBSTRS
            )

        tools = []
        if self.config.enable_cmd:
            tools.append(create_cmd_run_tool(use_short_description=use_short_tool_desc))
        if self.config.enable_think:
            tools.append(ThinkTool)
        if self.config.enable_finish:
            tools.append(FinishTool)
        if self.config.enable_browsing:
            if sys.platform == 'win32':
                logger.warning('Windows runtime does not support browsing yet')
            else:
                tools.append(WebReadTool)
                tools.append(BrowserTool)
        if self.config.enable_jupyter:
            tools.append(IPythonTool)
        if self.config.enable_llm_editor:
            tools.append(LLMBasedFileEditTool)
        elif self.config.enable_editor:
            tools.append(
                create_str_replace_editor_tool(
                    use_short_description=use_short_tool_desc
                )
            )
        return tools

    def reset(self) -> None:
        """Resets the AI Agent."""
        super().reset()
        self.pending_actions.clear()

    def step(self, state: State) -> 'Action':
        """Performs one step using the AI Agent.

        This includes gathering info on previous steps and prompting the model to make a command to execute.

        Parameters:
        - state (State): used to get updated info

        Returns:
        - CmdRunAction(command) - bash command to run
        - IPythonRunCellAction(code) - IPython code to run
        - AgentDelegateAction(agent, inputs) - delegate action for (sub)task
        - MessageAction(content) - Message action to run (e.g. ask for clarification)
        - AgentFinishAction() - end the interaction
        """
        # Continue with pending actions if any
        if self.pending_actions:
            return self.pending_actions.popleft()

        # if we're done, go back
        latest_user_message = state.get_last_user_message()
        if latest_user_message and latest_user_message.content.strip() == '/exit':
            return AgentFinishAction()

        # Condense the events from the state. If we get a view we'll pass those
        # to the conversation manager for processing, but if we get a condensation
        # event we'll just return that instead of an action. The controller will
        # immediately ask the agent to step again with the new view.
        condensed_history: list[Event] = []
        match self.condenser.condensed_history(state):
            case View(events=events):
                condensed_history = events

            case Condensation(action=condensation_action):
                return condensation_action

        logger.debug(
            f'Processing {len(condensed_history)} events from a total of {len(state.history)} events'
        )

        initial_user_message = self._get_initial_user_message(state.history)
        messages = self._get_messages(condensed_history, initial_user_message)
        params: dict = {
            'messages': self.llm.format_messages_for_llm(messages),
        }
        params['tools'] = self.tools

        # Special handling for Gemini model which doesn't support default fields
        if self.llm.config.model == 'gemini-2.5-pro-preview-03-25':
            logger.info(
                f'Removing the default fields from tools for {self.llm.config.model} '
                "since it doesn't support them and the request would crash."
            )
            # prevent mutation of input tools
            params['tools'] = copy.deepcopy(params['tools'])
            # Strip off default fields that cause errors with gemini-preview
            for tool in params['tools']:
                if 'function' in tool and 'parameters' in tool['function']:
                    if 'properties' in tool['function']['parameters']:
                        for prop_name, prop in tool['function']['parameters'][
                            'properties'
                        ].items():
                            if 'default' in prop:
                                del prop['default']
        # log to litellm proxy if possible
        params['extra_body'] = {'metadata': state.to_llm_metadata(agent_name=self.name)}
        response = self.llm.completion(**params)
        logger.debug(f'Response from LLM: {response}')
        actions = self.response_to_actions(response)
        logger.debug(f'Actions after response_to_actions: {actions}')
        for action in actions:
            self.pending_actions.append(action)
        return self.pending_actions.popleft()

    def _get_initial_user_message(self, events: list[Event]) -> 'MessageAction':
        """Get the initial user message from the events."""
        for event in events:
            if event.source == EventSource.USER and isinstance(event, MessageAction):
                return event
        return None

    def _get_messages(
        self, events: list[Event], initial_user_message: 'MessageAction'
    ) -> list[Message]:
        """Convert events to messages for the LLM.

        The method performs the following steps:
        1. Checks for SystemMessageAction in events, adds one if missing (legacy support)
        2. Processes events (Actions and Observations) into messages, including SystemMessageAction
        3. Handles tool calls and their responses in function-calling mode
        4. Manages message role alternation (user/assistant/tool)
        5. Applies caching for specific LLM providers (e.g., Anthropic)
        6. Adds environment reminders for non-function-calling mode

        Args:
            events: The list of events to convert to messages
            initial_user_message: The initial user message

        Returns:
            list[Message]: A list of formatted messages ready for LLM consumption
        """
        if not self.prompt_manager:
            raise Exception('Prompt Manager not instantiated.')

        # Use ConversationMemory to process events (including SystemMessageAction)
        messages = self.conversation_memory.process_events(
            condensed_history=events,
            initial_user_action=initial_user_message,
            max_message_chars=self.llm.config.max_message_chars,
            vision_is_active=self.llm.vision_is_active(),
        )

        if self.llm.is_caching_prompt_active():
            self.conversation_memory.apply_prompt_caching(messages)

        return messages

    def response_to_actions(self, response: 'ModelResponse') -> list['Action']:
        return codeact_function_calling.response_to_actions(
            response, mcp_tool_names=list(self.mcp_tools.keys())
        )
