import { useTranslation } from "react-i18next";
import { ConnectToProviderMessage } from "./connect-to-provider-message";
import { RepositorySelectionForm } from "./repo-selection-form";
import { useConfig } from "#/hooks/query/use-config";
import { RepoProviderLinks } from "./repo-provider-links";
import { useUserProviders } from "#/hooks/use-user-providers";

interface RepoConnectorProps {
  onRepoSelection: (repoTitle: string | null) => void;
}

export function RepoConnector({ onRepoSelection }: RepoConnectorProps) {
  const { providers } = useUserProviders();
  const { data: config } = useConfig();
  const { t } = useTranslation();

  const isSaaS = config?.APP_MODE === "saas";
  const providersAreSet = providers.length > 0;

  return (
    <section
      data-testid="repo-connector"
      className="w-full flex flex-col gap-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
    >
      <h2 className="heading text-xl font-bold">{t("HOME$CONNECT_TO_REPOSITORY")}</h2>

      {!providersAreSet && <ConnectToProviderMessage />}
      {providersAreSet && (
        <RepositorySelectionForm onRepoSelection={onRepoSelection} />
      )}

      {isSaaS && providersAreSet && <RepoProviderLinks />}
    </section>
  );
}
