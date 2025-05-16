import { MoreVertical } from "lucide-react";

interface EllipsisButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function EllipsisButton({ onClick }: EllipsisButtonProps) {
  return (
    <button data-testid="ellipsis-button" type="button" onClick={onClick}>
      <MoreVertical size={16} className="text-[#a3a3a3]" />
    </button>
  );
}
