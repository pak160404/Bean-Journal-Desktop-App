"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Star, Sparkles } from 'lucide-react';

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
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.15], [0.8, 0]);

  return (
    <div
      ref={ref}
      className="h-[210vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <motion.div
        className="absolute inset-0 h-full w-full bg-slate-900 z-10 pointer-events-none"
        style={{ opacity: overlayOpacity }}
      ></motion.div>
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
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
  const glassCardStyle = "bg-slate-800/60 backdrop-blur-md p-6 rounded-xl border border-slate-700/50 shadow-lg relative";

  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0 z-20 flex flex-col md:flex-row items-center gap-8 md:gap-16">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Navigate</span> Your Growth Journey with 
          <span className="block mt-2">AI-Powered Insights</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl mx-auto md:mx-0">
          Bean Journal combines the power of daily journaling with artificial intelligence to help you track patterns, set goals, and grow mindfully.
        </p>
      </div>

      <motion.div
        className="flex-1 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="relative max-w-md mx-auto">
          <motion.div 
            className={glassCardStyle + " z-30"}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
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
              <div className="bg-slate-900/70 backdrop-blur-sm p-3 rounded-lg border border-slate-700/30">
                <p className="text-sm font-medium text-white">AI Insight:</p>
                <p className="text-xs text-slate-300">You seem to be experiencing mixed emotions today. Your anxiety level is 30% lower than last week. Great progress!</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`${glassCardStyle} absolute -bottom-10 -right-10 w-32 h-32 p-4 z-10`}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center mb-2">
                <Sparkles className="h-5 w-5 text-indigo-300" />
              </div>
              <p className="text-xs text-center font-medium text-indigo-300">7-Day Streak</p>
            </div>
          </motion.div>

          <motion.div
            className={`${glassCardStyle} absolute -top-5 -left-5 w-28 h-28 p-4 z-20`}
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
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
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0"
    >
      <img
        src={product.thumbnail}
        height={600}
        width={600}
        className="object-cover object-left-top absolute h-full w-full inset-0"
        alt={product.title}
      />
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2>
    </motion.div>
  );
};
