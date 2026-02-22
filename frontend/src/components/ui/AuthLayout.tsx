import { motion } from "framer-motion";
import { C } from "./palette";
import { FadeUp, GlassCard } from "./SharedComponents";
import { Link } from "react-router-dom";

export default function AuthLayout({
  children,
  title,
  subtitle,
  linkText,
  linkHref,
  linkDescription,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
  linkDescription: string;
}) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-5 relative overflow-hidden"
      style={{ background: C.bg }}
    >
      {/* Decorative blurred gradients */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: C.accent1 }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: C.accent2 }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2.5 mb-6 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200/50"
              style={{ background: "linear-gradient(135deg,#7C5CFC,#C084FC)" }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="2" fill="#fff" opacity="0.9" />
                <rect x="9" y="1" width="6" height="6" rx="2" fill="#fff" opacity="0.6" />
                <rect x="1" y="9" width="6" height="6" rx="2" fill="#fff" opacity="0.6" />
                <rect x="9" y="9" width="6" height="6" rx="2" fill="#fff" opacity="0.9" />
              </svg>
            </motion.div>
            <span className="font-bold text-lg tracking-tight" style={{ color: C.text }}>
              Pixel Stock
            </span>
          </Link>
          
          <FadeUp>
            <h1 className="display font-bold text-3xl text-center mb-2" style={{ color: C.text }}>
              {title}
            </h1>
          </FadeUp>
          <FadeUp delay={0.05}>
            <p className="text-center text-sm" style={{ color: C.muted }}>
              {subtitle}
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.1}>
          <GlassCard className="p-8 sm:p-10" hover={false}>
            {children}
            
            <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: "rgba(124,92,252,0.08)" }}>
              <p className="text-sm font-medium" style={{ color: C.muted }}>
                {linkDescription}{" "}
                <Link 
                  to={linkHref} 
                  className="font-bold transition-colors hover:opacity-80"
                  style={{ color: C.accent1 }}
                >
                  {linkText}
                </Link>
              </p>
            </div>
          </GlassCard>
        </FadeUp>
      </div>
    </div>
  );
}
