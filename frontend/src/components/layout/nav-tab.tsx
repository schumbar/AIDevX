import { NavLink } from "react-router";
import { cn } from "#/utils/utils";
import { BetaBadge } from "./beta-badge";
import { LoadingSpinner } from "../shared/loading-spinner";

interface NavTabProps {
  to: string;
  label: string | React.ReactNode;
  icon: React.ReactNode;
  isBeta?: boolean;
  isLoading?: boolean;
  rightContent?: React.ReactNode;
}

export function NavTab({
  to,
  label,
  icon,
  isBeta,
  isLoading,
  rightContent,
}: NavTabProps) {
  return (
    <NavLink
      end
      key={to}
      to={to}
      className={cn(
        "px-3 border-b border-r border-neutral-600 bg-base-secondary flex-1",
        "first-of-type:rounded-tl-xl last-of-type:rounded-tr-xl last-of-type:border-r-0",
        "flex items-center gap-2 h-full min-h-[40px]",
        "transition-all duration-200 ease-in-out hover:bg-neutral-700",
        "relative overflow-hidden"
      )}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-logo"></div>
          )}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className={cn(
                "transition-all duration-200",
                isActive ? "text-logo" : "text-neutral-400",
                "hover:text-content"
              )}>
                {icon}
              </div>
              <span className={cn(
                "transition-all duration-200",
                isActive ? "text-content font-medium" : "text-neutral-400",
                "hover:text-content"
              )}>
                {label}
              </span>
              {isBeta && <BetaBadge />}
            </div>
            <div className="flex items-center gap-2">
              {rightContent}
              {isLoading && <LoadingSpinner size="small" />}
            </div>
          </div>
        </>
      )}
    </NavLink>
  );
}
