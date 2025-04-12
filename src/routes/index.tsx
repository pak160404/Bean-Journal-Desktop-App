import { useRef, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import AIShowcaseSection from '@/components/sections/AIShowcaseSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import PricingSection from '@/components/sections/PricingSection';
import FaqSection from '@/components/sections/FaqSection';
import CtaSection from '@/components/sections/CtaSection';
import StarryBackground from '@/components/StarryBackground';
import { createFileRoute } from '@tanstack/react-router'

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

  // Create stars for the static background (in addition to the canvas animation)
  const stars = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 5 + 2
  }));

  // Easter egg - shooting star that appears occasionally
  useEffect(() => {
    const shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to trigger
        const shootingStar = document.createElement('div');
        // Add a class for styling the shooting star (you'll need to define this in your CSS)
        shootingStar.classList.add('shooting-star'); 
        shootingStar.style.position = 'absolute'; // Ensure it's positioned correctly
        shootingStar.style.top = `${Math.random() * 50}%`;
        shootingStar.style.left = `${Math.random() * 100}%`;
        // Add basic styles inline or use the class 'shooting-star'
        shootingStar.style.width = '100px'; 
        shootingStar.style.height = '2px';
        shootingStar.style.backgroundColor = 'white';
        shootingStar.style.transform = 'rotate(-45deg)'; // Example angle
        shootingStar.style.zIndex = '100'; // Ensure it's visible

        if (containerRef.current) {
          containerRef.current.appendChild(shootingStar);

          // Simple animation - make it fade out or move quickly
          setTimeout(() => {
             if (shootingStar) shootingStar.style.opacity = '0'; // Fade out
          }, 800); // Start fading before removal

          setTimeout(() => {
            if (shootingStar) shootingStar.remove();
          }, 1000); // Remove after animation
        }
      }
    }, 8000);

    return () => clearInterval(shootingStarInterval);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div ref={containerRef} className="landing-page-theme min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Static star background */}
      <div className="fixed inset-0 z-0 pointer-events-none"> {/* Added pointer-events-none */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: 0.5, // Initial opacity
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2], // Twinkling effect
              scale: [1, 1.2, 1],     // Slight size change
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated stars background - Assuming this component renders a canvas or similar */}
      <StarryBackground />

      <Navbar />

      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <AIShowcaseSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>

      <Footer />

      {/* Scroll progress indicator */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}

// Exporting the component directly as default is common practice
// export default Index; // No longer needed as it's the route component
