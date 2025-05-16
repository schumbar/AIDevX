# AI Agent Framework

This folder implements the AI Agent, a specialized agent for end-to-end machine learning pipelines. It is based on the CodeAct Agent framework but with specialized prompts and capabilities for ML tasks.

## Overview

The AI Agent operates through the same function calling interface as the CodeAct agent. It is designed to handle the complete machine learning workflow from data understanding to model deployment, with a focus on automating the entire process.

The agent can:
1. Analyze datasets to understand their structure and content
2. Perform data preparation and cleaning
3. Create visualizations to explore data relationships
4. Conduct feature engineering and selection
5. Select appropriate models based on the data and task
6. Train and evaluate models
7. Deploy models for inference
8. Generate comprehensive reports of the entire process

## Built-in Tools

The agent provides the same built-in tools as the CodeAct agent:

### 1. `execute_bash`
- Execute any valid Linux bash command
- Handles long-running commands by running them in background with output redirection
- Supports interactive processes with STDIN input and process interruption
- Handles command timeouts with automatic retry in background mode

### 2. `execute_ipython_cell`
- Run Python code in an IPython environment
- Supports magic commands like `%pip`
- Variables are scoped to the IPython environment
- Requires defining variables and importing packages before use

### 3. `web_read` and `browser`
- `web_read`: Read and convert webpage content to markdown
- `browser`: Interact with webpages through Python code
- Supports common browser actions like navigation, clicking, form filling, scrolling
- Handles file uploads and drag-and-drop operations

### 4. `str_replace_editor`
- View, create and edit files through string replacement
- Persistent state across command calls
- File viewing with line numbers
- String replacement with exact matching
- Undo functionality for edits

### 5. `edit_file` (LLM-based)
- Edit files using LLM-based content generation
- Support for partial file edits with line ranges
- Handles large files by editing specific sections
- Append mode for adding content to files

## Configuration

The agent can be configured with the same options as the CodeAct agent:
- `enable_cmd`: Enable bash command execution
- `enable_think`: Enable the think tool
- `enable_finish`: Enable the finish tool
- `enable_browsing`: Enable browser interaction tools
- `enable_jupyter`: Enable IPython code execution
- `enable_llm_editor`: Enable LLM-based file editing
- `enable_editor`: Enable string replacement editor (if LLM editor is disabled)

## ML Pipeline Workflow

The AI Agent follows a structured workflow for ML tasks:

1. **Data Understanding**: Analyze dataset structure, statistics, and relationships
2. **Data Preparation**: Clean, transform, and prepare data for modeling
3. **Data Visualization**: Create visualizations to explore patterns and relationships
4. **Feature Engineering**: Create, transform, and select features
5. **Model Selection**: Choose appropriate models based on the data and task
6. **Model Training**: Train and tune models with appropriate parameters
7. **Model Evaluation**: Evaluate models using appropriate metrics
8. **Model Deployment**: Save models and create inference code
9. **Reporting**: Generate comprehensive reports of the entire process

## Usage

To use the AI Agent, specify it as the agent when starting OpenHands:

```bash
poetry run python ./openhands/core/main.py -c AIAgent -t "Analyze this dataset and build a model"
```

Or in the web interface, select "AIAgent" from the agent dropdown.
