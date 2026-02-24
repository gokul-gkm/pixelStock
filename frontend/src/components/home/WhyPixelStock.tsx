import { C } from "../ui/palette";
import { FadeUp, SectionHeader, Section, GlassCard } from "../ui/SharedComponents";
import { WHY_ITEMS } from "../ui/data";

export default function WhyPixelStock() {
  const stats = [
    { val: "10K+",  label: "Creators" },
    { val: "2M+",   label: "Images Hosted" },
    { val: "99.9%", label: "Uptime SLA" },
    { val: "<50ms", label: "Load Time" },
  ];

  return (
    <Section className="py-20 sm:py-28 md:py-36" id="why">
      <SectionHeader
        label="Why Pixel Stock"
        title={<>Built for creators<br className="hidden sm:block" /> who care about craft.</>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {WHY_ITEMS.map((item, i) => (
          <FadeUp key={item.title} delay={i * 0.08}>
            <GlassCard className="p-6 sm:p-7 h-full flex flex-col gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: "rgba(124,92,252,0.08)" }}
              >
                {item.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base mb-1.5" style={{ color: C.text }}>
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: C.muted }}>
                  {item.desc}
                </p>
              </div>
            </GlassCard>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.28}>
        <div
          className="mt-8 sm:mt-10 rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center border"
          style={{
            background: "rgba(255,255,255,0.85)",
            borderColor: "rgba(124,92,252,0.10)",
            boxShadow: "0 4px 24px rgba(124,92,252,0.07)",
          }}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5">
              <div
                className="display font-black text-3xl sm:text-4xl tabular-nums"
                style={{
                  background: "linear-gradient(135deg,#7C5CFC,#C084FC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {s.val}
              </div>
              <div className="text-xs font-semibold" style={{ color: C.muted }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </FadeUp>
    </Section>
  );
}
