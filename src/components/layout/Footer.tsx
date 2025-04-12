import { Facebook, Twitter, Instagram, Linkedin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import logo_bean_journal from '@/images/logo_bean_journal.png';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Animated stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src={logo_bean_journal} alt="Bean Journal Logo" className="h-14 w-14 rounded-lg" />
              <span className="text-xl font-semibold text-white">Bean Journal</span>
            </div>
            <p className="text-slate-400 mb-6">
              Your AI-powered journal companion for mindful productivity and personal growth.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Testimonials</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">About</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
          <p>&copy; {new Date().getFullYear()} Bean Journal. All rights reserved.</p>
          <div className="flex justify-center mt-4 text-indigo-400">
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
            <Star fill="currentColor" size={16} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;