import Navbar from "../components/layouts/Navbar";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import FeatureHighlight from "../components/home/FeatureHighlight";
import WhyPixelStock from "../components/home/WhyPixelStock";
import CTASection from "../components/home/CTASection";
import Footer from "../components/layouts/Footer";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F8F7FF",
        color: "#1A1033",
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Sora:wght@400;600;700;800&display=swap');

        /* Typography */
        .display { font-family: 'Sora', system-ui, sans-serif; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #C084FC55; border-radius: 99px; }
        ::-webkit-scrollbar-track { background: transparent; }

        /* Smooth scroll */
        html { scroll-behavior: smooth; }

        /* Alternate section backgrounds for visual rhythm */
        #how    { background: #F8F7FF; }
        #features { background: rgba(255,255,255,0.55); }
        #why    { background: #F8F7FF; }
      `}</style>

      <Navbar />

      <main>
        <HeroSection />
        <HowItWorks />
        <FeatureHighlight />
        <WhyPixelStock />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}