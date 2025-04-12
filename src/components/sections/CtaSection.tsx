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
        
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
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
              Join thousands of users who are transforming their productivity and well-being with Bean Journey.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg h-auto shadow-lg shadow-indigo-600/20 group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
            
            <p className="mt-4 text-sm text-slate-400">No credit card required. Free 14-day trial.</p>
          </motion.div>

          {/* Testimonial floating card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
            className="mt-16 glass-card p-6 max-w-md mx-auto border border-indigo-500/20"
          >
            <div className="flex text-yellow-400 mb-4 justify-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <p className="italic text-slate-300 mb-6">
              "Bean Journey has completely transformed my daily routine. The AI insights are incredibly helpful!"
            </p>
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-indigo-500/30 flex items-center justify-center mr-3">
                <span className="text-indigo-300 font-semibold">S</span>
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Sarah Johnson</p>
                <p className="text-sm text-slate-400">Product Designer</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;