import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Rocket, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CtaSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  return (
    <section ref={ref} className="section relative overflow-hidden bg-slate-900 border-t border-slate-800">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-slate-900/80"></div>
        
        {/* Floating icons */}
        <motion.div 
          className="absolute text-indigo-500/20"
          style={{ top: '15%', left: '10%' }}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <Rocket className="h-20 w-20" />
        </motion.div>
        
        <motion.div 
          className="absolute text-indigo-500/20"
          style={{ bottom: '20%', right: '15%' }}
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          <Star className="h-16 w-16" />
        </motion.div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div 
          style={{ y, opacity }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <span className="inline-block px-4 py-1 bg-indigo-500/20 text-indigo-300 rounded-full mb-4 backdrop-blur-sm border border-indigo-500/20">
              Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Start Your Journaling <span className="text-gradient">Journey</span> Today
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of users who are transforming their productivity and well-being with Bean Journal.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button className="bg-indigo-600 hover:bg-[#ffd1fb] text-white px-8 py-6 text-lg h-auto shadow-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
            
            <p className="mt-4 text-sm text-slate-400">No credit card required. Free 14-day trial.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;