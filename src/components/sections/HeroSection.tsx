import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  // Generate stars with random positions and sizes
  const stars = Array.from({ length: 100 }).map(() => ({
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 5 + 2,
    delay: Math.random() * 2,
  }));

  const planets = [
    { size: 100, x: '85%', y: '50%', color: 'rgba(99, 102, 241, 0.3)' },
    { size: 40, x: '10%', y: '30%', color: 'rgba(59, 130, 246, 0.3)' },
    { size: 60, x: '70%', y: '15%', color: 'rgba(139, 92, 246, 0.3)' },
  ];

  return (
    <div 
      ref={ref} 
      className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900 pt-20"
    >
      {/* Stars background */}
      <div className="absolute inset-0 z-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: star.size,
              height: star.size,
              left: `${star.x}%`,
              top: `${star.y}%`,
              opacity: 0.5,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Planets/orbs */}
      {planets.map((planet, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: planet.size,
            height: planet.size,
            left: planet.x,
            top: planet.y,
            background: planet.color,
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shooting stars */}
      <motion.div
        className="absolute w-40 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
        style={{
          top: '20%',
          left: '10%',
          rotate: 35,
        }}
        animate={{
          x: ['-100%', '200%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 7,
        }}
      />
      <motion.div
        className="absolute w-60 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        style={{
          top: '40%',
          right: '20%',
          rotate: -25,
        }}
        animate={{
          x: ['100%', '-200%'],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          repeatDelay: 15,
          delay: 3,
        }}
      />

      <div className="container mx-auto px-4 z-10 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Navigate</span> Your Growth Journey with 
                <span className="block mt-2">AI-Powered Insights</span>
              </h1>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Bean Journey combines the power of daily journaling with artificial intelligence to help you track patterns, set goals, and grow mindfully.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg h-auto"
                onClick={() => console.log("Get started")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                className="border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10 px-8 py-6 text-lg h-auto"
              >
                Explore Features
              </Button>
            </motion.div>

            <motion.div
              className="mt-8 text-sm text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              No credit card required • Free 14-day trial
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1 relative"
            style={{ y, opacity }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative max-w-md mx-auto">
              {/* Main journal card */}
              <motion.div 
                className="glass-card p-6 relative z-30"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg text-white">Today's Reflection</h3>
                  <span className="text-sm text-slate-400">April 12, 2025</span>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-slate-300">Making progress on the new AI features. The team is excited about the launch, but I'm still a bit anxious about the timeline...</p>
                  <div className="h-2 w-full rounded-full bg-slate-700">
                    <div className="h-full rounded-full bg-indigo-500 w-3/4" />
                  </div>
                  <div className="bg-slate-800/60 backdrop-blur-sm p-3 rounded-lg border border-slate-700/50">
                    <p className="text-sm font-medium text-white">AI Insight:</p>
                    <p className="text-xs text-slate-300">You seem to be experiencing mixed emotions today. Your anxiety level is 30% lower than last week. Great progress!</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -bottom-10 -right-10 w-32 h-32 glass-card p-4 z-10"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center mb-2">
                    <Sparkles className="h-5 w-5 text-indigo-300" />
                  </div>
                  <p className="text-xs text-center font-medium text-indigo-300">7-Day Streak</p>
                </div>
              </motion.div>

              <motion.div
                className="absolute -top-5 -left-5 w-28 h-28 glass-card p-4 z-20"
                animate={{
                  y: [0, 15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-blue-300" />
                  </div>
                  <p className="text-xs text-center font-medium text-blue-300">Mood Trends</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;