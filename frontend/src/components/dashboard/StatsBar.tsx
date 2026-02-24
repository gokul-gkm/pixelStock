import { C } from "../ui/palette";
import type { ImageItem } from "../../services/api/image.api";

export function StatsBar({ images }: { images: ImageItem[] }) {
  const total = images.length;
  const pub   = images.filter(i => i.visibility === "public").length;
  const priv  = total - pub;

  const stats = [
    { label: "Total Images", value: total, color: C.accent1,  bg: "rgba(124,92,252,0.08)",  border: "rgba(124,92,252,0.15)"  },
    { label: "Public",       value: pub,   color: "#15803D",  bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.15)"   },
    { label: "Private",      value: priv,  color: "#DC2626",  bg: "rgba(255,107,107,0.08)", border: "rgba(255,107,107,0.15)" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map(s => (
        <div
          key={s.label}
          className="rounded-2xl px-4 py-3 text-center"
          style={{ background: s.bg, border: `1px solid ${s.border}` }}
        >
          <div className="display font-bold text-2xl" style={{ color: s.color }}>{s.value}</div>
          <div className="text-[11px] font-medium mt-0.5" style={{ color: C.muted }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
