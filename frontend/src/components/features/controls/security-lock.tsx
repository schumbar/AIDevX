import { ShieldCheck } from "lucide-react";

interface SecurityLockProps {
  onClick: () => void;
}

export function SecurityLock({ onClick }: SecurityLockProps) {
  return (
    <div
      className="cursor-pointer hover:opacity-80 transition-all"
      style={{ marginRight: "8px" }}
      onClick={onClick}
    >
      <ShieldCheck size={20} />
    </div>
  );
}
