import { useTranslation } from "react-i18next";
import { useCreateConversation } from "#/hooks/mutation/use-create-conversation";
import { useIsCreatingConversation } from "#/hooks/use-is-creating-conversation";
import { BrandButton } from "../settings/brand-button";
import AllHandsLogo from "#/assets/branding/all-hands-logo-spark.svg?react";

export function HomeHeader() {
  const {
    mutate: createConversation,
    isPending,
    isSuccess,
  } = useCreateConversation();
  const isCreatingConversationElsewhere = useIsCreatingConversation();
  const { t } = useTranslation();

  // We check for isSuccess because the app might require time to render
  // into the new conversation screen after the conversation is created.
  const isCreatingConversation =
    isPending || isSuccess || isCreatingConversationElsewhere;

  return (
    <header className="flex flex-col gap-5">
      <div className="flex justify-center">
        <AllHandsLogo width={100} height={100} />
      </div>

      <div className="flex items-center justify-between">
        <BrandButton
          testId="header-launch-button"
          variant="primary"
          type="button"
          onClick={() => createConversation({ conversation_trigger: "gui" })}
          isDisabled={isCreatingConversation}
        >
          {!isCreatingConversation && "Launch from Scratch"}
          {isCreatingConversation && t("HOME$LOADING")}
        </BrandButton>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm max-w-[424px]">
          {t("HOME$OPENHANDS_DESCRIPTION")}
        </p>
      </div>
    </header>
  );
}
