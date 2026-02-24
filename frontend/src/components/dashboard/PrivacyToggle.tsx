import { C } from "../ui/palette";
import { IconGlobe, IconLock, IconSpin } from "../ui/icons";

interface PrivacyToggleProps {
  value: boolean;
  onChange: () => void;
  loading?: boolean;
}

export function PrivacyToggle({ value, onChange, loading }: PrivacyToggleProps) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      disabled={loading}
      className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold transition-all"
      style={{
        background: value ? "rgba(34,197,94,0.15)" : "rgba(124,92,252,0.12)",
        color: value ? "#15803D" : C.accent1,
        border: `1px solid ${value ? "rgba(34,197,94,0.25)" : "rgba(124,92,252,0.2)"}`,
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? <IconSpin size={10} /> : value ? <IconGlobe /> : <IconLock />}
      {value ? "Public" : "Private"}
    </button>
  );
}
