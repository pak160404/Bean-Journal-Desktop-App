import { useRef, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import Footer from '@/components/layout/Footer';
//import Navbar from '@/components/layout/Navbar';
//import HeroSection from '@/components/sections/HeroSection';
//import FeaturesSection from '@/components/sections/FeaturesSection';
//import AIShowcaseSection from '@/components/sections/AIShowcaseSection';
//import TestimonialsSection from '@/components/sections/TestimonialsSection';
//import PricingSection from '@/components/sections/PricingSection';
//import FaqSection from '@/components/sections/FaqSection';
//import CtaSection from '@/components/sections/CtaSection';
import { createFileRoute } from '@tanstack/react-router'
import Hero from '@/components/hero-section';
import Features from '@/components/features';
//import Features10 from '@/components/features-10';
import Testimonials from '@/components/testimonials';
import Faq from '@/components/faqs';
import Cta from '@/components/call-to-action';
import { HeroHeader } from "@/components/hero5-header";

// Import landing page specific styles
import '../landing-page-theme.css'; 
import '../landing-page-app.css';

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  // Apply theme class to body when component mounts, remove on unmount
  useEffect(() => {
    document.body.classList.add('landing-page-theme');
    return () => {
      document.body.classList.remove('landing-page-theme');
    };
  }, []);

  return (
    <div ref={containerRef} className="landing-page-theme min-h-screen bg-white text-slate-900 relative overflow-hidden">

      {/* <Navbar /> */}
      <HeroHeader />

      <main className="relative z-10">
        {/* <HeroSection /> */}
        {/* <FeaturesSection /> */}
        {/* <AIShowcaseSection /> */}
        {/* <TestimonialsSection /> */}
        {/* <PricingSection /> */}
        {/* <FaqSection /> */}
        {/* <CtaSection /> */}
        <Hero />
        <Features />
        {/* <Features10 /> */}
        <Testimonials />
        <Faq />
        <Cta />
      </main>

      <Footer />

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffd1fb] to-[#B6D78A] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}

// Exporting the component directly as default is common practice
// export default Index; // No longer needed as it's the route component
