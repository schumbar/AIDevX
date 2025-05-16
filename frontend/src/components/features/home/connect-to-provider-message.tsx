import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { BrandButton } from "#/components/features/settings/brand-button";
import { useSettings } from "#/hooks/query/use-settings";

export function ConnectToProviderMessage() {
  const { isLoading } = useSettings();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
      <p className="text-gray-700 dark:text-gray-300">{t("HOME$CONNECT_PROVIDER_MESSAGE")}</p>
      <Link 
        data-testid="navigate-to-settings-button" 
        to="/settings/git"
        className="self-start"
      >
        <BrandButton type="button" variant="primary" isDisabled={isLoading}>
          {!isLoading && t("SETTINGS$TITLE")}
          {isLoading && t("HOME$LOADING")}
        </BrandButton>
      </Link>
    </div>
  );
}
