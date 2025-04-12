import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PenLine, Brain, LineChart, Calendar, Sparkles, Shield } from 'lucide-react';

const features = [
  {
    icon: <PenLine className="h-6 w-6" />,
    title: "Intuitive Journaling",
    description: "Beautifully designed interface that makes daily journaling a joy, not a chore."
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI-Powered Insights",
    description: "Uncover patterns in your thoughts and emotions with AI that understands context and nuance."
  },
  {
    icon: <LineChart className="h-6 w-6" />,
    title: "Progress Tracking",
    description: "Visualize your personal growth journey with beautiful charts and analytics."
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Daily Prompts",
    description: "Never run out of journaling ideas with our AI-generated daily prompts."
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Smart Suggestions",
    description: "Get personalized recommendations to improve productivity and well-being."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Privacy First",
    description: "Your thoughts are yours alone. Military-grade encryption keeps your journal secure."
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card p-6 glow-effect"
    >
      <div className="h-12 w-12 rounded-lg bg-indigo-900/50 text-indigo-400 flex items-center justify-center mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
      <p className="text-slate-300">{feature.description}</p>
    </motion.div>
  );
};

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
      
      <div className="container mx-auto relative z-10">
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
            Bean Journey combines the power of consistent journaling with artificial intelligence to help you achieve your goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
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