import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Sparkles, LineChart, Target, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const AIShowcaseSection = () => {
  const [activeDemo, setActiveDemo] = useState<'journal' | 'insights' | 'goals'>('journal');
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  const journalPrompt = "Had a busy day today. Meeting with the team went well, but I'm still worried about the project deadline. Need to find more time to exercise.";

  const demoContent = {
    journal: {
      title: "Smart Journal Analysis",
      description: "Our AI reads between the lines to understand your mood, stressors, and achievements.",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-800/70 p-4 border border-slate-700/50 backdrop-blur-sm">
            <p className="text-sm text-slate-300 mb-4">{journalPrompt}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <div className="text-xs text-blue-400">Detected Emotion: Mixed (70% positive, 30% concern)</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                <div className="text-xs text-amber-400">Stress Trigger: Project deadline</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <div className="text-xs text-green-400">Achievement: Successful team meeting</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <div className="text-xs text-purple-400">Action Item: Schedule exercise time</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    insights: {
      title: "Pattern Recognition",
      description: "Our AI identifies trends in your journal entries over time to help you grow.",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-800/70 p-4 border border-slate-700/50 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-indigo-400 mb-2">Monthly Insight Report</h4>
            <div className="space-y-3">
              <div className="bg-slate-700/50 p-3 rounded">
                <p className="text-xs text-slate-300">You've mentioned <span className="text-red-400 font-medium">deadline stress</span> in 7 of your last 10 entries. Consider using the <span className="text-indigo-400">time-blocking technique</span> to better manage project timelines.</p>
              </div>
              <div className="h-20 w-full flex items-end justify-between gap-1">
                {[0.3, 0.5, 0.4, 0.7, 0.6, 0.3, 0.8, 0.7, 0.6, 0.4].map((val, i) => (
                  <div key={i} className="h-full flex flex-col justify-end gap-1 flex-1">
                    <div 
                      className="bg-red-500/70 rounded-t w-full" 
                      style={{ height: `${val * 100}%` }}
                    ></div>
                    <div 
                      className="bg-amber-500/70 rounded-t w-full" 
                      style={{ height: `${(Math.sin(i) + 1) / 2 * 80}%` }}
                    ></div>
                    <div 
                      className="bg-green-500/70 rounded-t w-full" 
                      style={{ height: `${(Math.cos(i) + 1) / 2 * 70}%` }}
                    ></div>
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
      description: "Our AI helps you set achievable goals based on your habits and preferences.",
      content: (
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-800/70 p-4 border border-slate-700/50 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-indigo-400 mb-2">Personalized Goal Recommendations</h4>
            <div className="space-y-3">
              <div className="bg-slate-700/50 p-3 rounded flex items-start gap-3">
                <Target className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white">Exercise 3x per week</p>
                  <p className="text-xs text-slate-300 mt-1">Based on your entries, morning workouts on Mon/Wed/Fri would fit best with your schedule.</p>
                  <div className="mt-2 w-full bg-slate-600 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">40% complete this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <section id="ai-showcase" ref={ref} className="section relative z-10 bg-slate-900">
      {/* Space themed background with stars */}
      <div className="absolute inset-0 overflow-hidden">
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
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          style={{ opacity, y }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center p-2 bg-indigo-900/30 rounded-full mb-4">
            <Brain className="w-6 h-6 text-indigo-400" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="text-gradient">AI-Powered</span> Journal Intelligence
          </h2>
          
          <p className="text-lg text-slate-300">
            Our advanced AI transforms your simple journal entries into powerful insights, patterns, and personalized recommendations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold text-white">The Magic Behind Your Journal</h3>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="glass-card p-5 border border-indigo-900/20"
              >
                <div className="flex gap-3">
                  <Brain className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Natural Language Processing</h4>
                    <p className="text-slate-300">Our AI understands the context and emotions behind your words, not just the keywords.</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="glass-card p-5 border border-indigo-900/20"
              >
                <div className="flex gap-3">
                  <LineChart className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Pattern Recognition</h4>
                    <p className="text-slate-300">By analyzing your entries over time, our AI can identify trends in your mood, productivity, and habits.</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="glass-card p-5 border border-indigo-900/20"
              >
                <div className="flex gap-3">
                  <MessageSquare className="h-6 w-6 text-indigo-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-2">Personalized Recommendations</h4>
                    <p className="text-slate-300">Get AI-generated suggestions that are tailored to your unique situation and goals.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="pt-6">
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => console.log("Try AI features")}
              >
                Experience AI Magic
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="glass-card border border-indigo-900/20"
          >
            <div className="p-6">
              <div className="flex space-x-2 mb-6">
                <button 
                  onClick={() => setActiveDemo('journal')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeDemo === 'journal' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-700/70 text-slate-300 hover:bg-slate-600/70'
                  }`}
                >
                  Journal
                </button>
                <button 
                  onClick={() => setActiveDemo('insights')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeDemo === 'insights' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-700/70 text-slate-300 hover:bg-slate-600/70'
                  }`}
                >
                  Insights
                </button>
                <button 
                  onClick={() => setActiveDemo('goals')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeDemo === 'goals' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-700/70 text-slate-300 hover:bg-slate-600/70'
                  }`}
                >
                  Goals
                </button>
              </div>
              
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white mb-2">{demoContent[activeDemo].title}</h3>
                <p className="text-slate-300 text-sm mb-6">{demoContent[activeDemo].description}</p>
                {demoContent[activeDemo].content}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIShowcaseSection;