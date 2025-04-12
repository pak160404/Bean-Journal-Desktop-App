"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PenLine, Brain, LineChart, Calendar, Sparkles, Shield } from 'lucide-react';
import { GlowingEffect } from "@/components/ui/glowing-effect";


const FeaturesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <section id="features" ref={ref} className="section relative z-10 bg-slate-900">
      {/* Orbital background elements */}
      <div className="orb w-96 h-96 top-20 -left-48"></div>
      <div className="orb w-80 h-80 bottom-20 -right-40"></div>
      
      <div className="container mx-auto relative z-10 px-6">
        <motion.div 
          style={{ opacity, y }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center p-2 bg-indigo-900/30 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Grow Mindfully with <span className="text-gradient">AI-Enhanced</span> Journaling
          </h2>
          
          <p className="text-lg text-slate-300">
            Bean Journal combines the power of consistent journaling with artificial intelligence to help you achieve your goals.
          </p>
        </motion.div>

        {/* Bento Grid Layout - Fills Space */}
        <div className="grid grid-cols-12 auto-rows-[minmax(180px,auto)] gap-4 md:gap-6">
          {/* Row 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="col-span-12 md:col-span-7 row-span-1"
          >
            <div className="relative h-full rounded-2xl border border-slate-800 p-2 md:rounded-3xl md:p-3">
              <GlowingEffect blur={0} borderWidth={2} spread={80} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
              <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl bg-slate-900/90 p-5 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                <div className="relative flex flex-1 flex-col justify-between gap-3">
                  <div className="w-fit rounded-lg bg-indigo-900/50 p-2">
                    <PenLine className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans text-xl font-semibold text-balance text-white md:text-2xl">
                      Intuitive Journaling
                    </h3>
                    <p className="font-sans text-sm/[1.125rem] text-slate-300">
                      Beautifully designed interface that makes daily journaling a joy, not a chore.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-50px" }}
            className="col-span-12 md:col-span-5 row-span-1"
          >
            <div className="relative h-full rounded-2xl border border-slate-800 p-2 md:rounded-3xl md:p-3">
              <GlowingEffect blur={0} borderWidth={2} spread={80} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
              <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl bg-slate-900/90 p-5 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                <div className="relative flex flex-1 flex-col justify-between gap-3">
                  <div className="w-fit rounded-lg bg-indigo-900/50 p-2">
                    <Brain className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans text-xl font-semibold text-balance text-white">
                      AI-Powered Insights
                    </h3>
                    <p className="font-sans text-sm/[1.125rem] text-slate-300">
                      Uncover patterns in your thoughts and emotions with AI that understands context and nuance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Row 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-50px" }}
            className="col-span-12 md:col-span-5 row-span-2"
          >
            <div className="relative h-full rounded-2xl border border-slate-800 p-2 md:rounded-3xl md:p-3">
              <GlowingEffect blur={0} borderWidth={2} spread={80} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
              <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl bg-slate-900/90 p-5 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                <div className="relative flex flex-1 flex-col justify-between gap-3">
                  <div className="w-fit rounded-lg bg-indigo-900/50 p-2">
                    <LineChart className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans text-xl font-semibold text-balance text-white md:text-2xl">
                      Progress Tracking
                    </h3>
                    <p className="font-sans text-sm/[1.125rem] text-slate-300">
                      Visualize your personal growth journey with beautiful charts and analytics that help you see patterns over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-50px" }}
            className="col-span-12 md:col-span-7 row-span-1"
          >
            <div className="relative h-full rounded-2xl border border-slate-800 p-2 md:rounded-3xl md:p-3">
              <GlowingEffect blur={0} borderWidth={2} spread={80} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
              <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl bg-slate-900/90 p-5 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                <div className="relative flex flex-1 flex-col justify-between gap-3">
                  <div className="w-fit rounded-lg bg-indigo-900/50 p-2">
                    <Calendar className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans text-xl font-semibold text-balance text-white">
                      Daily Prompts
                    </h3>
                    <p className="font-sans text-sm/[1.125rem] text-slate-300">
                      Never run out of journaling ideas with our AI-generated daily prompts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Row 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true, margin: "-50px" }}
            className="col-span-12 md:col-span-3 row-span-1"
          >
            <div className="relative h-full rounded-2xl border border-slate-800 p-2 md:rounded-3xl md:p-3">
              <GlowingEffect blur={0} borderWidth={2} spread={80} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
              <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl bg-slate-900/90 p-5 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                <div className="relative flex flex-1 flex-col justify-between gap-3">
                  <div className="w-fit rounded-lg bg-indigo-900/50 p-2">
                    <Sparkles className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans text-xl font-semibold text-balance text-white">
                      Smart Suggestions
                    </h3>
                    <p className="font-sans text-sm/[1.125rem] text-slate-300">
                      Get personalized recommendations to improve productivity and well-being.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true, margin: "-50px" }}
            className="col-span-12 md:col-span-4 row-span-1"
          >
            <div className="relative h-full rounded-2xl border border-slate-800 p-2 md:rounded-3xl md:p-3">
              <GlowingEffect blur={0} borderWidth={2} spread={80} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
              <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl bg-slate-900/90 p-5 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                <div className="relative flex flex-1 flex-col justify-between gap-3">
                  <div className="w-fit rounded-lg bg-indigo-900/50 p-2">
                    <Shield className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans text-xl font-semibold text-balance text-white">
                      Privacy First
                    </h3>
                    <p className="font-sans text-sm/[1.125rem] text-slate-300">
                      Your thoughts are yours alone. Military-grade encryption keeps your journal secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 text-center"
        >
          <a href="#ai-showcase" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
            <span className="mr-2">See how our AI works</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;