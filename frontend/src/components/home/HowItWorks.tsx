import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { C } from "../ui/palette";
import { FadeUp, SectionHeader, Section, GlassCard } from "../ui/SharedComponents";
import { IMAGES } from "../ui/data";
import { useRef } from "react";
import { useInView } from "framer-motion";

/* ─── UPLOAD VISUAL ─────────────────────────────────────────── */
function UploadVisual() {
  const [tog, setTog] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setTog((p) => !p), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/70 py-8 flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center shadow-lg shadow-purple-200/60">
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
            <path d="M9 12V4M9 4L6 7M9 4l3 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 14h12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-xs text-purple-500 font-semibold">Drop images here</span>
        <span className="text-[10px] text-purple-300 font-medium">PNG, JPG, WEBP up to 20MB</span>
      </div>
      <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-purple-100 shadow-sm">
        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
          <span className="text-purple-500 text-xs">🖼</span>
        </div>
        <span className="text-xs text-gray-600 flex-1 font-medium">sunset-haze.jpg</span>
        <div
          onClick={() => setTog((p) => !p)}
          className="relative w-10 h-5 rounded-full cursor-pointer shrink-0"
          style={{
            background: tog ? "linear-gradient(90deg,#7C5CFC,#C084FC)" : "#E0DDF0",
            transition: "background 0.3s",
          }}
        >
          <motion.div
            animate={{ x: tog ? 18 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-[3px] w-[14px] h-[14px] bg-white rounded-full shadow-sm"
          />
        </div>
        <span className="text-[11px] font-bold w-12" style={{ color: tog ? C.accent1 : C.muted }}>
          {tog ? "Public" : "Private"}
        </span>
      </div>
    </div>
  );
}

/* ─── EXPLORE VISUAL ────────────────────────────────────────── */
function ExploreVisual() {
  const items = [
    { bg: "linear-gradient(135deg,#667EEA,#764BA2)", h: 64 },
    { bg: "linear-gradient(135deg,#F093FB,#F5576C)", h: 80 },
    { bg: "linear-gradient(135deg,#43E97B,#38F9D7)", h: 68 },
    { bg: "linear-gradient(135deg,#FBC2EB,#A6C1EE)", h: 88 },
    { bg: "linear-gradient(135deg,#FA709A,#FEE140)", h: 72 },
    { bg: "linear-gradient(135deg,#4FACFE,#00F2FE)", h: 76 },
  ];
  return (
    <div className="columns-2 sm:columns-3 gap-2 pt-1">
      {items.map((it, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.04, y: -2 }}
          transition={{ duration: 0.2 }}
          className="mb-2 rounded-xl overflow-hidden cursor-pointer shadow-sm"
          style={{ background: it.bg, height: it.h }}
        />
      ))}
    </div>
  );
}

/* ─── DRAG VISUAL ───────────────────────────────────────────── */
export function DragVisual() {
  const cards = [
    { id: "a", bg: "linear-gradient(135deg,#667EEA,#764BA2)", x: 0,  y: 0  },
    { id: "b", bg: "linear-gradient(135deg,#F093FB,#F5576C)", x: 92, y: 0  },
    { id: "c", bg: "linear-gradient(135deg,#43E97B,#38F9D7)", x: 0,  y: 88 },
    { id: "d", bg: "linear-gradient(135deg,#FA709A,#FEE140)", x: 92, y: 88 },
  ];
  const [dragging, setDragging] = useState<string | null>(null);
  return (
    <div className="relative h-44 w-full overflow-visible">
      {cards.map((it, idx) => (
        <motion.div
          key={it.id}
          drag
          dragConstraints={{ left: -10, right: 60, top: -10, bottom: 50 }}
          onDragStart={() => setDragging(it.id)}
          onDragEnd={() => setDragging(null)}
          whileHover={{ scale: 1.06 }}
          whileDrag={{ scale: 1.12, boxShadow: "0 20px 40px rgba(124,92,252,0.3)" }}
          initial={{ x: it.x, y: it.y }}
          className="absolute rounded-xl cursor-grab active:cursor-grabbing shadow-md"
          style={{
            background: it.bg,
            width: 76,
            height: 76,
            zIndex: dragging === it.id ? 50 : idx,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-50">
            <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
              <path d="M6 4h4M6 8h4M6 12h4M4 4h.01M4 8h.01M4 12h.01"
                stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>
      ))}
      <div className="absolute bottom-1 right-0 text-[10px] text-purple-400 font-semibold bg-white/80 px-2 py-1 rounded-lg backdrop-blur-sm">
        ✦ Try dragging
      </div>
    </div>
  );
}

/* ─── MASONRY GRID ──────────────────────────────────────────── */
export function MasonrySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className="columns-2 md:columns-3 gap-2 sm:gap-3">
      {IMAGES.map((img, i) => (
        <motion.div
          key={img.id}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-2 sm:mb-3 rounded-xl sm:rounded-2xl relative overflow-hidden group cursor-pointer"
          style={{ background: img.bg, height: img.h * 0.75 }}
          whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(0,0,0,0.15)" }}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-white text-[10px] sm:text-xs font-semibold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {img.label}
            </span>
          </div>
          {img.priv && (
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-md px-1.5 py-0.5">
              <span className="text-white text-[9px] sm:text-[10px] font-bold">🔒 Private</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── HOW IT WORKS — ICON DEFINITIONS ──────────────────────── */
const HOW_CARDS = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 28 28">
        <rect x="2" y="2" width="24" height="24" rx="7" fill="url(#hiw-g1)" />
        <path d="M14 9v10M9 14h10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        <defs>
          <linearGradient id="hiw-g1" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C5CFC" /><stop offset="1" stopColor="#C084FC" />
          </linearGradient>
        </defs>
      </svg>
    ),
    tag: "01", title: "Upload & Store",
    desc: "Drag images straight from your desktop. Choose Public to share with the world, or Private for your eyes only.",
    visual: <UploadVisual />,
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 28 28">
        <rect x="2" y="2" width="24" height="24" rx="7" fill="url(#hiw-g2)" />
        <circle cx="14" cy="14" r="5" stroke="#fff" strokeWidth="2.2" />
        <path d="M14 5v2M14 21v2M5 14h2M21 14h2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="hiw-g2" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F093FB" /><stop offset="1" stopColor="#F5576C" />
          </linearGradient>
        </defs>
      </svg>
    ),
    tag: "02", title: "Explore Creative Works",
    desc: "Browse a curated community grid. Discover inspiring public images from creators around the globe.",
    visual: <ExploreVisual />,
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 28 28">
        <rect x="2" y="2" width="24" height="24" rx="7" fill="url(#hiw-g3)" />
        <rect x="7" y="8" width="6" height="6" rx="2" fill="#fff" opacity="0.9" />
        <rect x="15" y="8" width="6" height="6" rx="2" fill="#fff" opacity="0.6" />
        <rect x="7" y="16" width="6" height="6" rx="2" fill="#fff" opacity="0.6" />
        <rect x="15" y="16" width="6" height="6" rx="2" fill="#fff" opacity="0.9" />
        <defs>
          <linearGradient id="hiw-g3" x1="2" y1="2" x2="26" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4FACFE" /><stop offset="1" stopColor="#43E97B" />
          </linearGradient>
        </defs>
      </svg>
    ),
    tag: "03", title: "Drag, Drop & Organize",
    desc: "Rearrange your gallery exactly how you want. Your personal canvas — no restrictions, total creative control.",
    visual: <DragVisual />,
  },
];

/* ─── HOW IT WORKS SECTION ──────────────────────────────────── */
export default function HowItWorks() {
  return (
    <Section className="py-20 sm:py-28 md:py-36" id="how">
      <SectionHeader
        label="How It Works"
        title={<>Three steps to your<br className="hidden sm:block" /> perfect gallery</>}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {HOW_CARDS.map((card, i) => (
          <FadeUp key={card.tag} delay={i * 0.1}>
            <GlassCard className="p-6 sm:p-7 h-full flex flex-col gap-5">
              <div className="flex items-center justify-between">
                {card.icon}
                <span
                  className="font-black text-xs tracking-[0.18em] tabular-nums"
                  style={{ color: C.accent2 }}
                >
                  {card.tag}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="display font-semibold text-lg mb-2" style={{ color: C.text }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                  {card.desc}
                </p>
              </div>
              <div className="pt-2 border-t" style={{ borderColor: "rgba(124,92,252,0.08)" }}>
                {card.visual}
              </div>
            </GlassCard>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}
