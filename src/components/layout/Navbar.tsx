"use client";
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { useScroll } from "framer-motion";
import logo_bean_journey from '@/images/logo_bean_journal.png';
import { cn } from '@/utils/css';

// Define Bean Journey specific nav items
const beanJourneyNavItems = [
  { name: 'Features', link: '#features' },
  { name: 'AI', link: '#ai-showcase' },
  { name: 'Testimonials', link: '#testimonials' },
  { name: 'Pricing', link: '#pricing' },
  { name: 'FAQ', link: '#faq' },
];

// Reverted to standard img tag, removed memo
const BeanJourneyLogo = () => (
  <a href="/" className="relative z-20 flex items-center space-x-2 text-sm font-normal">
    <img 
      src={logo_bean_journey} 
      alt="Bean Journey Logo" 
      width="40" // Explicitly set width attribute
      height="40" // Explicitly set height attribute
      className="h-10 w-10" // Classes remain for styling
    />
    {/* Text color changes based on dark mode and potentially scroll state if customized further */}
    <span className="font-bold text-xl text-slate-100 dark:text-white">Bean Journey</span> 
  </a>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setScrolled(latest > 20);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    // Use ResizableNavbar, force fixed positioning, keep it transparent
    <ResizableNavbar className={cn(
      "fixed top-0 inset-x-0 z-50", // Fixed position
      "bg-transparent" // Keep outer container transparent always
      // Removed conditional bg/blur/shadow from here
    )}>
      {/* Desktop Navigation - Conditionally style NavBody based on scroll */}
      <NavBody className={cn(
        "lg:flex w-full max-w-7xl mx-auto transition-all duration-300", // Base layout and transition
        "px-4 py-2", // Padding
        // Apply scrolled styles OR initial transparent styles
        scrolled
          ? "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md shadow-sm rounded-full" // Scrolled appearance (like demo)
          : "!rounded-none !bg-transparent !shadow-none !backdrop-filter-none" // Initial appearance (full-width, transparent)
      )}>
          <BeanJourneyLogo />
          <NavItems 
            items={beanJourneyNavItems} 
            // Text color needs to work on both backgrounds
            className={cn(
              "transition-colors",
              // Adjust text based on scroll. Use resizable-navbar defaults for scrolled state.
              scrolled ? "text-neutral-600 dark:text-neutral-300" : "text-slate-300 hover:text-white"
              )}
            onItemClick={() => setIsMobileMenuOpen(false)} 
          />
          <div className="hidden md:flex items-center gap-4 z-20 relative">
            {/* Buttons */}
            <NavbarButton 
              as="button" 
              variant="secondary" 
              className="!border !border-indigo-400/30 !text-indigo-400 hover:!bg-indigo-400/10 dark:!text-indigo-300 dark:hover:!bg-indigo-400/20 !px-4 !py-2 !rounded-md !font-medium"
            >
              Log In
            </NavbarButton>
            <NavbarButton 
              as="button" 
              variant="dark" 
              className="!bg-indigo-600 hover:!bg-indigo-700 !text-white !px-4 !py-2 !rounded-md !font-medium"
            >
              Get Started
            </NavbarButton>
          </div>
      </NavBody>

      {/* Mobile Navigation - Keep mobile header consistent, menu is separate */} 
      <MobileNav className={cn(
         "md:hidden w-full", 
         "!rounded-none !bg-transparent !shadow-none !backdrop-filter-none", // Keep mobile header transparent
         "px-4 py-2 border-b border-transparent" // Padding
      )}>
        <MobileNavHeader>
          <BeanJourneyLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        {/* Mobile Menu itself remains dark */}
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          className="!bg-slate-900/95 backdrop-blur-md !top-full !border-t !border-slate-800"
        >
          {beanJourneyNavItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <span className="block py-1">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-2 pt-4 border-t border-slate-800">
            <NavbarButton
              as="button"
              onClick={() => setIsMobileMenuOpen(false)}
              variant="secondary"
              className="!border !border-indigo-400/30 !text-indigo-400 hover:!bg-indigo-400/10 !w-full !py-2 !font-medium"
            >
              Log In
            </NavbarButton>
            <NavbarButton
              as="button"
              onClick={() => setIsMobileMenuOpen(false)}
              variant="dark"
              className="!bg-indigo-600 hover:!bg-indigo-700 !text-white !w-full !py-2 !font-medium"
            >
              Get Started
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
};

export default Navbar;