import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useCreateConversation } from "#/hooks/mutation/use-create-conversation";
import { useIsCreatingConversation } from "#/hooks/use-is-creating-conversation";
import { I18nKey } from "#/i18n/declaration";
import LambdaLogo from "#/assets/branding/lambda-logo";

export function WelcomeScreen() {
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

  // Function to handle navigation to settings
  const goToSettings = () => {
    console.log("Navigating to settings");
    navigate("/settings/git");
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full p-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border border-gray-700"
      >
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200
            }}
            className="flex justify-center mb-2"
          >
            <LambdaLogo size={150} color="#FFD700" />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl font-bold mb-4 text-white">AIDevX</h1>
            <p className="text-gray-300 max-w-md mx-auto mb-2">
              {t("HOME$OPENHANDS_DESCRIPTION")}
            </p>
            <div className="text-xs text-blue-400 hover:text-blue-300">
              <a href="/home" className="underline">Go to home page</a>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col gap-6 w-full max-w-md"
          >
            <div className="flex justify-center w-full">
              <button
                data-testid="welcome-launch-button"
                type="button"
                onClick={() => {
                  console.log("Launch button clicked");
                  createConversation({ conversation_trigger: "gui" });
                }}
                disabled={isCreatingConversation}
                className="relative z-10 bg-primary text-[#0D0F11] py-4 px-8 rounded-lg text-lg font-medium hover:opacity-90 active:opacity-80 transition-all duration-150 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
              >
                {!isCreatingConversation ? (
                  <span>Launch from Scratch</span>
                ) : (
                  <span>{t("HOME$LOADING")}</span>
                )}
              </button>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300 text-sm mb-4">
                To get started with suggested tasks, please connect your GitHub or GitLab account.
              </p>
              <div className="flex justify-center w-full">
                <button
                  type="button"
                  onClick={goToSettings}
                  className="relative z-10 border border-primary text-primary py-3 px-6 rounded-lg font-medium hover:bg-primary/10 active:bg-primary/20 transition-all duration-150 shadow-md hover:shadow-lg min-w-[150px]"
                >
                  {t(I18nKey.SETTINGS$TITLE)}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
