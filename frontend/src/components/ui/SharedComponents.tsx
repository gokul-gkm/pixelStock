import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { C } from "./palette";

export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
      style={{
        background: "rgba(124,92,252,0.08)",
        border: "1px solid rgba(124,92,252,0.18)",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
      <span className="text-[11px] font-semibold text-purple-600 tracking-widest uppercase">
        {children}
      </span>
    </div>
  );
}

export function SectionHeader({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-14 md:mb-20">
      <FadeUp>
        <SectionLabel>{label}</SectionLabel>
      </FadeUp>
      <FadeUp delay={0.08}>
        <h2
          className="display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight"
          style={{ color: C.text }}
        >
          {title}
        </h2>
      </FadeUp>
      {subtitle && (
        <FadeUp delay={0.15}>
          <p
            className="mt-5 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: C.muted }}
          >
            {subtitle}
          </p>
        </FadeUp>
      )}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section id={id} className={`w-full ${className}`} style={style}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        {children}
      </div>
    </section>
  );
}

export function GlassCard({
  children,
  className = "",
  style = {},
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: "0 24px 60px rgba(124,92,252,0.14)" } : {}}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border ${className}`}
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(124,92,252,0.10)",
        boxShadow: "0 4px 20px rgba(124,92,252,0.06)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

export function PrivacyToggle({ initial }: { initial: boolean }) {
  const [pub, setPub] = useState(initial);
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <span
        className="text-[11px] font-semibold w-12 text-right"
        style={{ color: pub ? C.accent1 : C.muted }}
      >
        {pub ? "Public" : "Private"}
      </span>
      <div
        onClick={() => setPub((p) => !p)}
        className="relative w-9 h-5 rounded-full cursor-pointer shrink-0"
        style={{
          background: pub ? "linear-gradient(90deg,#7C5CFC,#C084FC)" : "#E0DDF0",
          transition: "background 0.3s",
        }}
      >
        <motion.div
          animate={{ x: pub ? 17 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-[3px] w-[14px] h-[14px] bg-white rounded-full shadow-sm"
        />
      </div>
    </div>
  );
}
