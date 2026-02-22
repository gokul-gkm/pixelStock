import { motion } from "framer-motion";
import { C } from "../ui/palette";
import { Section } from "../ui/SharedComponents";
import HeroMockup from "./HeroMockup";

export default function HeroSection() {
  return (
    <Section className="relative overflow-hidden pt-32 sm:pt-36 md:pt-44 pb-20 sm:pb-28 md:pb-36">
      {/* Ambient background blobs — contained, no overflow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.18] blur-[100px]"
          style={{ background: "radial-gradient(circle,#7C5CFC,transparent 70%)" }}
        />
        <div
          className="absolute top-20 -right-20 w-96 h-96 rounded-full opacity-[0.12] blur-[80px]"
          style={{ background: "radial-gradient(circle,#C084FC,transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 -left-20 w-96 h-96 rounded-full opacity-[0.10] blur-[80px]"
          style={{ background: "radial-gradient(circle,#FF6B6B,transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-0">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs sm:text-sm font-semibold mb-8"
          style={{
            background: "rgba(124,92,252,0.07)",
            borderColor: "rgba(124,92,252,0.2)",
            color: C.accent1,
          }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            ✦
          </motion.span>
          Your Creative Canvas
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="display font-extrabold tracking-tight leading-[1.08] mb-6"
          style={{
            color: C.text,
            fontSize: "clamp(2rem, 5.5vw, 4.5rem)",
          }}
        >
          Organize, Explore &amp;{" "}
          <span
            style={{
              background: "linear-gradient(135deg,#7C5CFC,#C084FC,#FF6B6B)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Showcase
          </span>
          <br />
          Your Images Beautifully
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="text-base sm:text-lg md:text-xl max-w-lg leading-relaxed mb-10"
          style={{ color: C.muted }}
        >
          Upload images as{" "}
          <strong style={{ color: C.text, fontWeight: 600 }}>public or private</strong>.
          Build a stunning personal gallery. Drag, drop, and rearrange — your way.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 items-center mb-16 sm:mb-20 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 48px rgba(124,92,252,0.38)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-white text-sm sm:text-base"
            style={{
              background: "linear-gradient(135deg,#7C5CFC,#C084FC)",
              boxShadow: "0 8px 28px rgba(124,92,252,0.32)",
            }}
          >
            Get Started Free →
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-sm sm:text-base border"
            style={{
              background: "rgba(255,255,255,0.92)",
              color: C.text,
              borderColor: "rgba(124,92,252,0.22)",
              backdropFilter: "blur(12px)",
            }}
          >
            🔍 Explore Images
          </motion.button>
        </motion.div>

        {/* Hero Mockup — full width, constrained max */}
        <div className="w-full max-w-3xl mx-auto">
          <HeroMockup />
        </div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-10 text-xs sm:text-sm font-medium"
          style={{ color: C.muted }}
        >
          No credit card required · Free forever · 10,000+ creators joined
        </motion.p>
      </div>
    </Section>
  );
}
