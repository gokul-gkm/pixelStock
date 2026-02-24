import { motion } from "framer-motion";
import { C } from "../ui/palette";
import { FadeUp, Section } from "../ui/SharedComponents";
import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    <Section className="py-16 sm:py-24 md:py-32">
      <FadeUp>
        <div
          className="relative rounded-3xl overflow-hidden text-center"
          style={{ background: "linear-gradient(135deg,#7C5CFC 0%,#A855F7 45%,#FF6B6B 100%)" }}
        >
          <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-25 pointer-events-none"
            style={{ background: "radial-gradient(circle,#fff,transparent 70%)" }}
          />
          <div
            className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full opacity-20 pointer-events-none"
            style={{ background: "radial-gradient(circle,#fff,transparent 70%)" }}
          />

          <div className="relative z-10 px-6 sm:px-14 md:px-20 py-16 sm:py-20">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block text-2xl mb-5"
            >
              ✦
            </motion.div>

            <h2 className="display font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight tracking-tight mb-4 sm:mb-5">
              Start Organizing Your
              <br className="hidden sm:block" /> Creativity Today
            </h2>

            <p className="text-purple-100 text-base sm:text-lg mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">
              Join thousands of creators building beautiful, organized image
              galleries — for free.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth/sign-up">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 16px 48px rgba(0,0,0,0.22)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base"
                style={{ background: "#fff", color: C.accent1 }}
              >
                Get Started Free →
                </motion.button>
                </Link>
              <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-semibold text-base border-2 text-white"
                style={{ borderColor: "rgba(255,255,255,0.45)" }}
              >
                Explore Gallery
                </motion.button>
                </Link>
            </div>
          </div>
        </div>
      </FadeUp>
    </Section>
  );
}
