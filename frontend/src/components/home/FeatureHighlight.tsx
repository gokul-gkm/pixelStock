import { C } from "../ui/palette";
import { FadeUp, SectionHeader, Section, GlassCard, PrivacyToggle } from "../ui/SharedComponents";
import { IMAGES } from "../ui/data";
import { MasonrySection, DragVisual } from "./HowItWorks";

export default function FeatureHighlight() {
  return (
    <Section
      className="py-20 sm:py-28 md:py-36"
      id="features"
      style={{ background: "rgba(255,255,255,0.45)" }}
    >
      <SectionHeader
        label="Feature Highlights"
        title="Your images, your rules."
        subtitle="A masonry grid that adapts to your collection. Privacy toggles on every image. Custom layout arrangements that persist forever."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        <FadeUp>
          <GlassCard className="overflow-hidden p-5 sm:p-6" hover={false}>
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-sm" style={{ color: C.text }}>
                My Gallery
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)" }}
                >
                  Masonry
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                  style={{ color: C.muted, borderColor: "rgba(124,92,252,0.15)" }}
                >
                  Grid
                </button>
              </div>
            </div>
            <MasonrySection />
          </GlassCard>
        </FadeUp>

        <div className="flex flex-col gap-5 sm:gap-6">
          <FadeUp delay={0.1}>
            <GlassCard className="p-5 sm:p-6">
              <h4 className="font-semibold text-sm mb-4" style={{ color: C.text }}>
                Privacy Controls
              </h4>
              <div className="flex flex-col gap-3">
                {["mountain-mist.jpg", "bloom-abstract.jpg", "ocean-light.jpg"].map((name, i) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "#F6F4FF" }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg shrink-0"
                      style={{ background: IMAGES[i].bg }}
                    />
                    <span
                      className="text-xs font-medium flex-1 truncate min-w-0"
                      style={{ color: C.text }}
                    >
                      {name}
                    </span>
                    <PrivacyToggle initial={i !== 1} />
                  </div>
                ))}
              </div>
            </GlassCard>
          </FadeUp>

          <FadeUp delay={0.18}>
            <GlassCard className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-sm" style={{ color: C.text }}>
                  Custom Arrangement
                </h4>
                <span
                  className="text-[11px] font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(124,92,252,0.1)", color: C.accent1 }}
                >
                  Drag to reorder
                </span>
              </div>
              <DragVisual />
            </GlassCard>
          </FadeUp>
        </div>
      </div>
    </Section>
  );
}
