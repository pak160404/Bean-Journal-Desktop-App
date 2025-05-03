import { useRef, useEffect } from 'react';
import Pricing from '@/components/pricing';
import Comparator from '@/components/pricing-comparator';
import { HeroHeader } from "@/components/hero5-header";

// Import landing page specific styles
import '../landing-page-theme.css'; 
import '../landing-page-app.css';
import { createFileRoute } from '@tanstack/react-router';
import Footer from '@/components/layout/Footer';

export const Route = createFileRoute('/pricing')({
  component: Index,
})

function Index() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Apply theme class to body when component mounts, remove on unmount
  useEffect(() => {
    document.body.classList.add('landing-page-theme');
    return () => {
      document.body.classList.remove('landing-page-theme');
    };
  }, []);

  return (
    <div ref={containerRef} className="landing-page-theme min-h-screen bg-white text-slate-900 relative overflow-hidden">

      <HeroHeader />

      <main className="relative z-10 mt-[7rem]">
        <Pricing />
        <Comparator />
      </main>

      <Footer />

    </div>
  );
}

// Exporting the component directly as default is common practice
// export default Index; // No longer needed as it's the route component
