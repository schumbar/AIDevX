import { useTranslation } from "react-i18next";
import AllHandsLogo from "#/assets/branding/all-hands-logo.svg?react";
import { TooltipButton } from "./tooltip-button";

export function AIDevXLogoButton() {
  const { t } = useTranslation();

  return (
    <TooltipButton
      tooltip="AIDevX"
      ariaLabel="AIDevX Logo"
      navLinkTo="/"
    >
      <AllHandsLogo width={34} height={34} />
    </TooltipButton>
  );
}
