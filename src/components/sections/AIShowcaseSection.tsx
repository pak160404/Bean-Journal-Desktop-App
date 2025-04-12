import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, LineChart, Target, MessageSquare } from 'lucide-react';
import { cn } from "@/utils/css";
import React from 'react';

// --- Feature Card Components (from FeaturesSectionDemo) ---
const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-white text-xl md:text-2xl md:leading-snug font-semibold">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};
// --- End Feature Card Components ---


// --- Skeleton Components for AI Showcase ---

const SkeletonNLP = () => (
  <div className="flex gap-4 items-start mt-4 text-neutral-300">
    <Brain className="h-8 w-8 text-indigo-400 flex-shrink-0 mt-1" />
  </div>
);

const SkeletonPatterns = () => (
   <div className="flex gap-4 items-start mt-4 text-neutral-300">
    <LineChart className="h-8 w-8 text-indigo-400 flex-shrink-0 mt-1" />
  </div>
);

const SkeletonRecommendations = () => (
   <div className="flex gap-4 items-start mt-4 text-neutral-300">
    <MessageSquare className="h-8 w-8 text-indigo-400 flex-shrink-0 mt-1" />
  </div>
);

// Moved demo content definition here for SkeletonInteractiveDemo
const journalPrompt = "Had a busy day today. Meeting with the team went well, but I'm still worried about the project deadline. Need to find more time to exercise.";
const demoContentData = {
  journal: {
    title: "Smart Journal Analysis",
    description: "Our AI reads between the lines...",
    content: (
      <div className="space-y-4">
        <div className="rounded-lg bg-slate-800/70 p-4 border border-slate-700/50 backdrop-blur-sm">
          <p className="text-sm text-slate-300 mb-4">{journalPrompt}</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400"></div>
              <div className="text-xs text-blue-400">Emotion: Mixed (70% positive)</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400"></div>
              <div className="text-xs text-amber-400">Stress: Project deadline</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <div className="text-xs text-green-400">Achieved: Team meeting</div>
            </div>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <div className="text-xs text-purple-400">Action: Schedule exercise</div>
              </div>
          </div>
        </div>
      </div>
    )
  },
  insights: {
    title: "Pattern Recognition",
    description: "Our AI identifies trends...",
    content: (
       <div className="space-y-4">
          <div className="rounded-lg bg-slate-800/70 p-4 border border-slate-700/50 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-indigo-400 mb-2">Monthly Insight</h4>
            <div className="space-y-3">
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-xs text-slate-300">Noticed <span className="text-red-400 font-medium">deadline stress</span> 7/10 times. Try <span className="text-indigo-400">time-blocking</span>.</p>
              </div>
              {/* Simplified chart */}
              <div className="h-16 w-full flex items-end justify-between gap-1">
                {[0.3, 0.5, 0.4, 0.7, 0.6, 0.3, 0.8].map((val, i) => (
                  <div key={i} className="h-full flex flex-col justify-end gap-1 flex-1">
                    <div className="bg-red-500/70 rounded-t w-full" style={{ height: `${val * 100}%` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    )
  },
  goals: {
    title: "Smart Goal Setting",
    description: "Our AI helps you set goals...",
    content: (
       <div className="space-y-4">
          <div className="rounded-lg bg-slate-800/70 p-4 border border-slate-700/50 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-indigo-400 mb-2">Goal Suggestion</h4>
            <div className="space-y-3">
              <div className="bg-slate-700/50 p-3 rounded flex items-start gap-3">
                <Target className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Exercise 3x/week</p>
                  <p className="text-xs text-slate-300 mt-1">Suggesting Mon/Wed/Fri mornings.</p>
                  <div className="mt-2 w-full bg-slate-600 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">40% progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
};

const SkeletonInteractiveDemo = () => {
  const [activeDemo, setActiveDemo] = useState<'journal' | 'insights' | 'goals'>('journal');

  return (
    <div className="mt-4 p-1 rounded-lg bg-slate-900 border border-slate-700/50">
        <div className="flex justify-center space-x-1 mb-4 p-1 bg-slate-800 rounded-md">
          {(['journal', 'insights', 'goals'] as const).map(demoKey => (
             <button
              key={demoKey}
              onClick={() => setActiveDemo(demoKey)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all flex-1 text-center ${
                activeDemo === demoKey
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-700/70 text-slate-300 hover:bg-slate-600/70'
              }`}
            >
              {demoKey.charAt(0).toUpperCase() + demoKey.slice(1)}
            </button>
          ))}
        </div>

        <motion.div
          key={activeDemo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-2 pb-2"
        >
          {demoContentData[activeDemo].content}
        </motion.div>
      </div>
  );
}
// --- End Skeleton Components ---

// --- Main Component ---
const AIShowcaseSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [0, 1, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.15], [30, 0]);

  const features = [
     {
      title: "Natural Language Processing",
      description: "Our AI understands the context and emotions behind your words, not just the keywords.",
      skeleton: <SkeletonNLP />,
      className: "col-span-1 lg:col-span-2 border-b lg:border-r dark:border-neutral-800",
    },
     {
      title: "Pattern Recognition",
      description: "By analyzing your entries over time, our AI can identify trends in your mood, productivity, and habits.",
      skeleton: <SkeletonPatterns />,
      className: "col-span-1 lg:col-span-2 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Personalized Recommendations",
      description: "Get AI-generated suggestions that are tailored to your unique situation and goals.",
      skeleton: <SkeletonRecommendations />,
      className: "col-span-1 lg:col-span-2 border-b dark:border-neutral-800",
    },
     {
      title: "Interactive AI Demo",
      description: "See the AI analyze entries, find insights, and suggest goals.",
      skeleton: <SkeletonInteractiveDemo />,
      className: "col-span-1 lg:col-span-6",
    },
  ];

  return (
    <section ref={ref} id="ai-showcase" className="relative z-10 bg-slate-900 py-20 lg:py-32 dark:bg-black">
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 1.5 + 0.5,
              height: Math.random() * 1.5 + 0.5,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
            }}
            animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.2, 1] }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8">
         <motion.div
            style={{ opacity: headerOpacity, y: headerY }}
            className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
         >
             <div className="inline-flex items-center justify-center p-2 bg-indigo-900/30 rounded-full mb-4">
                 <Brain className="w-7 h-7 text-indigo-400" />
             </div>
             <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                 <span className="text-gradient">AI-Powered</span> Journal Intelligence
             </h2>
             <p className="text-lg text-neutral-300">
                 Transform your journal entries into powerful insights, patterns, and personalized recommendations.
             </p>
         </motion.div>

          <div className="relative">
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.6, delay: 0.2 }}
                 viewport={{ once: true }}
                 className="grid grid-cols-1 lg:grid-cols-6 mt-12 border rounded-lg dark:border-neutral-800 bg-slate-900/40 backdrop-blur-sm"
             >
                 {features.map((feature) => (
                     <FeatureCard key={feature.title} className={feature.className}>
                         <FeatureTitle>{feature.title}</FeatureTitle>
                         <FeatureDescription>{feature.description}</FeatureDescription>
                         <div className=" h-full w-full">{feature.skeleton}</div>
                     </FeatureCard>
                 ))}
             </motion.div>
          </div>
        </div>
    </section>
  );
};

export default AIShowcaseSection;