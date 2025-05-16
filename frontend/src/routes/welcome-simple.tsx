import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useCreateConversation } from "#/hooks/mutation/use-create-conversation";
import { useIsCreatingConversation } from "#/hooks/use-is-creating-conversation";
import { I18nKey } from "#/i18n/declaration";

function WelcomeSimple() {
  const {
    mutate: createConversation,
    isPending,
    isSuccess,
  } = useCreateConversation();
  const isCreatingConversationElsewhere = useIsCreatingConversation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // We check for isSuccess because the app might require time to render
  // into the new conversation screen after the conversation is created.
  const isCreatingConversation =
    isPending || isSuccess || isCreatingConversationElsewhere;

  const handleLaunchClick = () => {
    console.log("Launch button clicked");
    createConversation({ conversation_trigger: "gui" });
  };

  const handleSettingsClick = () => {
    console.log("Settings button clicked");
    navigate("/settings/git");
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900">
      <div className="max-w-2xl w-full p-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border border-gray-700">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
              <div className="text-[120px] font-bold text-yellow-400 relative z-10">λ</div>
            </div>
          </div>

          {/* Description */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-4 text-white">AIDevX</h1>
            <p className="text-gray-300 max-w-md mx-auto mb-2">
              {t("HOME$OPENHANDS_DESCRIPTION")}
            </p>
            <div className="text-xs text-blue-400 hover:text-blue-300">
              <a href="/home" className="underline">Go to home page</a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-6 w-full max-w-md">
            <div className="flex justify-center w-full">
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLaunchClick();
                }}
                className="relative z-10 bg-blue-600 text-white py-4 px-8 rounded-lg text-lg font-medium hover:bg-blue-500 active:bg-blue-700 transition-all duration-150 shadow-lg hover:shadow-xl min-w-[200px] text-center"
              >
                {!isCreatingConversation ? (
                  "Launch from Scratch"
                ) : (
                  t("HOME$LOADING")
                )}
              </a>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300 text-sm mb-4 text-center">
                To get started with suggested tasks, please connect your GitHub or GitLab account.
              </p>
              <div className="flex justify-center w-full">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSettingsClick();
                  }}
                  className="relative z-10 border border-blue-500 text-blue-400 py-3 px-6 rounded-lg font-medium hover:bg-blue-500/10 active:bg-blue-500/20 transition-all duration-150 shadow-md hover:shadow-lg min-w-[150px] text-center"
                >
                  {t(I18nKey.SETTINGS$TITLE)}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSimple;
