"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Star, Sparkles, BarChart3, Shield, Activity, ChevronRight, Check } from 'lucide-react';
import { ContainerTextFlip } from "./container-text-flip";

// Text animation helper component
const AnimatedText = ({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) => {
  // Split text into an array of letters
  const letters = Array.from(text);
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: delay * 0.1 },
    },
  };
  
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };
  
  return (
    <motion.span
      className={`inline-block overflow-visible ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block overflow-visible"
          variants={child}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Infinite marquee component
interface InfiniteMarqueeProps {
  thickness?: string;
  speed?: number;
  fromColor?: string;
  toColor?: string;
  fontSize?: string;
  reverse?: boolean;
}

const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({ 
  thickness = "py-2", 
  speed = 20, 
  fromColor = "from-indigo-600", 
  toColor = "to-blue-600",
  fontSize = "text-lg",
  reverse = false
}) => {
  const [contentWidth, setContentWidth] = React.useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const animationId = React.useMemo(() => `marquee-animation-${Math.random().toString(36).substr(2, 9)}`, []);
  
  // Measure the width of the content
  React.useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.offsetWidth);
    }
    
    // Add resize observer to remeasure if window resizes
    const resizeObserver = new ResizeObserver(() => {
      if (contentRef.current) {
        setContentWidth(contentRef.current.offsetWidth);
      }
    });
    
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    
    return () => {
      if (contentRef.current) {
        resizeObserver.unobserve(contentRef.current);
      }
    };
  }, []);
  
  // Create dynamic style for marquee animation
  React.useEffect(() => {
    // Create and append keyframe animation dynamically
    if (contentWidth > 0) {
      const styleSheet = document.createElement("style");
      styleSheet.id = animationId;
      styleSheet.innerHTML = `
        @keyframes marquee-${animationId} {
          0% {
            transform: translateX(${reverse ? `calc(-50% - ${contentWidth / 2}px)` : '0'});
          }
          100% {
            transform: translateX(${reverse ? '0' : `-${contentWidth}px`});
          }
        }
        
        .marquee-animate-${animationId} {
          animation: marquee-${animationId} ${contentWidth > 0 ? speed : 0}s linear infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .marquee-animate-${animationId} {
            animation-play-state: paused;
          }
        }
      `;
      
      // Remove any existing marquee animation style with this ID
      const existingStyle = document.getElementById(animationId);
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // Add the new style
      document.head.appendChild(styleSheet);
    }
    
    return () => {
      // Clean up the style element on unmount
      const styleElement = document.getElementById(animationId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [contentWidth, speed, reverse, animationId]);
  
  // Prepare the marquee items - "beanjournal" text with dot separators
  const marqueeItem = (
    <span className={`text-white font-bold mx-4 ${fontSize} uppercase tracking-wider inline-flex items-center gap-3`}>
      <span>BEANJOURNAL</span>
      <span className={`${fontSize} ml-[1.25rem]`} aria-hidden="true">•</span>
    </span>
  );
  
  // Create enough copies to ensure seamless scrolling
  const createContent = () => {
    // We need at least enough items to fill the container twice
    // to ensure the animation appears seamless
    return Array(50).fill(0).map((_, i) => (
      <React.Fragment key={i}>
        {marqueeItem}
      </React.Fragment>
    ));
  };
  
  return (
    <div 
      className={`w-full overflow-hidden bg-gradient-to-r ${fromColor} ${toColor} ${thickness} relative`}
      ref={containerRef}
    >
      <div 
        className={`flex whitespace-nowrap marquee-animate-${animationId}`}
        ref={contentRef}
      >
        {createContent()}
      </div>
    </div>
  );
};

export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, -100]),
    springConfig
  );
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.15], [0.8, 0]);

  return (
    <div
      ref={ref}
      className="h-[190vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <motion.div
        className="absolute inset-0 h-full w-full bg-slate-900/50 z-10 pointer-events-none"
        style={{ opacity: overlayOpacity }}
      ></motion.div>
      
      <Header />
      
      {/* Double infinite marquee lines */}
      <div className="relative w-[120%] z-30 mt-8 ml-[-10%] ">
        <InfiniteMarquee 
          thickness="py-2" 
          fromColor="from-indigo-600" 
          toColor="to-blue-600"
          speed={40}
          fontSize="text-lg"
        />
      </div>
      
      <div className="relative w-[120%] z-20 -mt-1 ml-[-1%] rotate-[5deg] opacity-70">
        <InfiniteMarquee 
          thickness="py-[0.4rem]" 
          fromColor="from-blue-500" 
          toColor="to-purple-600"
          speed={30}
          fontSize="text-sm"
          reverse
        />
      </div>
      
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="mt-40"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20 overflow-visible">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20 overflow-visible">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 overflow-visible">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const glassCardStyle = "bg-slate-800/40 backdrop-blur-md p-6 rounded-xl border border-slate-700/30 shadow-xl relative";
  const features = [
    { title: "AI-Powered Analysis", icon: <Activity className="h-5 w-5" /> },
    { title: "Daily Reflections", icon: <BarChart3 className="h-5 w-5" /> },
    { title: "Privacy First", icon: <Shield className="h-5 w-5" /> }
  ];

  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-32 px-4 w-full left-0 top-0 z-20 flex flex-col md:flex-row items-center gap-8 md:gap-16">
      <div className="flex-1 text-center md:text-left relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="mr-1 h-3 w-3" /> New AI Features Available
          </span>
        </motion.div>
        
        <div className="text-4xl md:text-7xl font-bold leading-relaxed mb-6 w-full overflow-visible">
          {/* <AnimatedText
            text="Navigate"
            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400"
            delay={1}
          /> */}
          <ContainerTextFlip
            words={["Tracking", "Charting", "Evolving", "Learning", "Refining"]}
            className="bg-transparent shadow-none border-none h-[5rem] p-0 m-0 align-baseline text-inherit dark:text-inherit"
            textClassName="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 p-0 m-0"
          />
          <AnimatedText text=" Your" delay={3} />
          <AnimatedText text=" Growth" delay={4} />
          <AnimatedText text=" Journey" delay={5} />
          <AnimatedText text=" with" delay={6} />
          <br />
          <div className="overflow-visible min-h-[1.2em]">
            <AnimatedText
              text="AI-Powered Insights"
              className="block mt-2 text-[3.7rem] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 pb-2 md:w-full"
              delay={7}
            />
          </div>
        </div>
        
        <motion.p 
          className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto md:mx-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Bean Journal combines the power of daily journaling with artificial intelligence to help you track patterns, set goals, and grow mindfully.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button 
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium transition-all flex items-center justify-center hover:from-indigo-600 hover:to-blue-600 shadow-lg shadow-indigo-500/20"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started Free <ChevronRight className="ml-2 h-4 w-4" />
          </motion.button>
          <motion.button 
            className="px-8 py-3 rounded-lg border border-slate-700 text-slate-300 font-medium transition-all hover:bg-slate-800/50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            View Demo
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap gap-y-3 gap-x-6 justify-center md:justify-start text-sm text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center mr-2">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span>{feature.title}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="flex-1 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="relative max-w-md mx-auto">
          {/* Main card */}
          <motion.div 
            className={`${glassCardStyle} z-30`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(76, 29, 149, 0.1), 0 10px 10px -5px rgba(76, 29, 149, 0.04)" }}
          >
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 rounded-t-xl"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg text-white">Today's Reflection</h3>
              <span className="text-sm text-slate-400">April 12, 2025</span>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-300">Making progress on the new AI features. The team is excited about the launch, but I'm still a bit anxious about the timeline...</p>
              <div className="h-2 w-full rounded-full bg-slate-700/50">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <div className="bg-slate-900/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/20">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center mr-2">
                    <Sparkles className="h-3 w-3 text-indigo-300" />
                  </div>
                  <p className="text-sm font-medium text-white">AI Insight:</p>
                </div>
                <p className="text-xs text-slate-300">You seem to be experiencing mixed emotions today. Your anxiety level is 30% lower than last week. Great progress!</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {[0, 1, 2].map(index => (
                <motion.button
                  key={index}
                  className={`h-1.5 rounded-full ${activeTab === index ? 'bg-indigo-500 w-6' : 'bg-slate-700 w-3'}`}
                  onClick={() => setActiveTab(index)}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Floating satellite cards */}
          <motion.div
            className={`${glassCardStyle} absolute -bottom-10 -right-10 w-32 h-32 p-4 z-10`}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.05, rotate: -5 }}
          >
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center mb-2 border border-indigo-500/20">
                <Sparkles className="h-5 w-5 text-indigo-300" />
              </div>
              <p className="text-xs text-center font-medium text-indigo-300">7-Day Streak</p>
            </div>
          </motion.div>

          <motion.div
            className={`${glassCardStyle} absolute -top-10 -left-10 w-32 h-32 p-4 z-20`}
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-2 border border-blue-500/20">
                <Star className="h-5 w-5 text-blue-300" />
              </div>
              <p className="text-xs text-center font-medium text-blue-300">Mood Trends</p>
            </div>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute -z-10 -bottom-6 -right-6 w-64 h-64 bg-indigo-500 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute -z-10 -top-6 -left-6 w-64 h-64 bg-blue-500 rounded-full opacity-5 blur-3xl"></div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0 rounded-xl overflow-hidden shadow-xl"
    >
      <img
        src={product.thumbnail}
        height={600}
        width={600}
        className="object-cover object-left-top absolute h-full w-full inset-0 transition-transform duration-500 group-hover/product:scale-110"
        alt={product.title}
      />
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent transition-all duration-300"></div>
      <div className="absolute bottom-0 left-0 p-6 transform translate-y-4 opacity-0 group-hover/product:opacity-100 group-hover/product:translate-y-0 transition-all duration-300">
        <h2 className="text-2xl font-bold text-white mb-2">
          {product.title}
        </h2>
        <div className="flex items-center">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            View Details
          </span>
        </div>
      </div>
    </motion.div>
  );
};
