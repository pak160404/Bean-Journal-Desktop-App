import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Button } from '@/components/ui/Button';
import logo_bean_journey from '@/images/logo_bean_journal.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => {
      setScrolled(y > 20);
    });

    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img 
              src={logo_bean_journey} 
              alt="Bean Journey Logo" 
              className="h-10 w-10"
            />
            <span className="font-bold text-xl text-black">Bean Journal</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-black hover:text-white transition-colors">Features</a>
            <a href="#ai-showcase" className="text-sm font-medium text-black hover:text-white transition-colors">AI</a>
            <a href="#testimonials" className="text-sm font-medium text-black hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm font-medium text-black hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-black hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10",
                    rootBox: "mr-2"
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="border-indigo-400/30 text-indigo-400 hover:bg-indigo-400/10">Log In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Get Started</Button>
              </SignUpButton>
            </SignedOut>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-slate-900/95 backdrop-blur-md absolute top-full left-0 right-0 p-4 border-t border-slate-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col space-y-4">
            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#ai-showcase" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">AI</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">FAQ</a>
            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/" 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-10 w-10"
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="border-indigo-400/30 text-indigo-400 hover:bg-indigo-400/10 w-full">Log In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">Get Started</Button>
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;