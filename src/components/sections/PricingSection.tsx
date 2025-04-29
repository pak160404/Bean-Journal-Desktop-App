import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Check, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type PricingPeriod = 'monthly' | 'annually';

interface PricingFeature {
  name: string;
  tooltip?: string;
}

const PricingSection = () => {
  const [period, setPeriod] = useState<PricingPeriod>('monthly');
  const [showComparison, setShowComparison] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  // Calculate annual savings
  const calculateSavings = (monthly: number, annually: number) => {
    const monthlyCost = monthly * 12;
    const annuallyCost = annually * 12;
    return Math.round((monthlyCost - annuallyCost) / monthlyCost * 100);
  };

  const plans = [
    {
      name: "Free",
      description: "Perfect for beginners starting their journey",
      price: { monthly: 0, annually: 0 },
      features: [
        { name: "5 journal entries per month", tooltip: "Limited to 5 new entries each month" },
        { name: "Basic AI insights", tooltip: "Simple pattern recognition and mood analysis" },
        { name: "Daily prompts", tooltip: "Access to our daily journaling prompts" },
        { name: "Mobile app access", tooltip: "Use Bean Journal on iOS and Android devices" }
      ] as PricingFeature[],
      mostPopular: false,
      ctaText: "Get Started Free",
      ctaColor: "bg-slate-800/80 border border-slate-700/50 text-white hover:bg-slate-700/80"
    },
    {
      name: "Growth",
      description: "For committed journalers seeking deeper insights",
      price: { monthly: 9.99, annually: 7.99 },
      features: [
        { name: "Unlimited journal entries", tooltip: "Create as many entries as you want" },
        { name: "Advanced AI insights", tooltip: "Deeper pattern recognition and personalized recommendations" },
        { name: "Custom prompts library", tooltip: "Access to 200+ specialized prompts and ability to create your own" },
        { name: "Mood and habit tracking", tooltip: "Track your moods and habits over time with visual analytics" },
        { name: "Priority support", tooltip: "Get help within 24 hours via email" }
      ] as PricingFeature[],
      mostPopular: true,
      ctaText: "Start Your Journey",
      ctaColor: "bg-indigo-600 hover:bg-indigo-700 text-white"
    },
    {
      name: "Premium",
      description: "For those serious about personal development",
      price: { monthly: 19.99, annually: 16.99 },
      features: [
        { name: "All Growth features", tooltip: "Includes everything in the Growth plan" },
        { name: "AI coaching recommendations", tooltip: "Personalized coaching based on your journal entries" },
        { name: "Advanced analytics dashboard", tooltip: "Comprehensive insights with exportable reports" },
        { name: "Goal setting and tracking", tooltip: "Set personal goals and track your progress" },
        { name: "Journal exporting", tooltip: "Export your journal in PDF, DOCX, or plain text formats" },
        { name: "Priority support", tooltip: "Get help within 12 hours via email or chat" }
      ] as PricingFeature[],
      mostPopular: false,
      ctaText: "Start Your Journey",
      ctaColor: "bg-slate-800/80 border border-slate-700/50 text-white hover:bg-slate-700/80"
    }
  ];

  // All possible features for comparison table
  const allFeatures = [
    { name: "Journal entries", free: "5 per month", growth: "Unlimited", premium: "Unlimited" },
    { name: "AI insights", free: "Basic", growth: "Advanced", premium: "Advanced" },
    { name: "Daily prompts", free: "✓", growth: "✓", premium: "✓" },
    { name: "Mobile app access", free: "✓", growth: "✓", premium: "✓" },
    { name: "Custom prompts", free: "✗", growth: "200+", premium: "300+" },
    { name: "Mood tracking", free: "✗", growth: "✓", premium: "✓" },
    { name: "Habit tracking", free: "✗", growth: "✓", premium: "✓" },
    { name: "AI coaching", free: "✗", growth: "✗", premium: "✓" },
    { name: "Analytics dashboard", free: "✗", growth: "Basic", premium: "Advanced" },
    { name: "Goal tracking", free: "✗", growth: "✗", premium: "✓" },
    { name: "Journal exporting", free: "✗", growth: "✗", premium: "✓" },
    { name: "Support", free: "Community", growth: "Priority (24h)", premium: "Priority (12h)" },
  ];

  return (
    <section id="pricing" ref={ref} className="section relative z-10 bg-slate-900 py-20">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb w-96 h-96 top-20 -left-48 opacity-10"></div>
        <div className="orb w-80 h-80 bottom-20 -right-40 opacity-10"></div>
        
        {/* Constellation effect */}
        {[...Array(12)].map((_, i) => {
          const x1 = Math.random() * 100;
          const y1 = Math.random() * 100;
          const x2 = x1 + (Math.random() * 20 - 10);
          const y2 = y1 + (Math.random() * 20 - 10);
          
          return (
            <motion.div key={i} className="absolute">
              <div 
                className="absolute bg-indigo-400/20 w-1 h-1 rounded-full"
                style={{ left: `${x1}%`, top: `${y1}%` }}
              ></div>
              <div 
                className="absolute bg-indigo-400/20 w-1 h-1 rounded-full"
                style={{ left: `${x2}%`, top: `${y2}%` }}
              ></div>
              <div 
                className="absolute bg-indigo-400/5"
                style={{ 
                  left: `${Math.min(x1, x2)}%`, 
                  top: `${Math.min(y1, y2)}%`,
                  width: `${Math.abs(x2 - x1)}%`,
                  height: '1px',
                  transform: `rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI}deg)`,
                  transformOrigin: 'top left'
                }}
              ></div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          style={{ opacity, y }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Simple, Transparent <span className="text-gradient">Pricing</span>
          </h2>
          
          <p className="text-lg text-slate-300 mb-8">
            Choose the plan that fits your journaling journey.
          </p>

          <div className="inline-flex p-1 bg-slate-800/50 rounded-lg backdrop-blur-sm mb-6">
            <button
              onClick={() => setPeriod('monthly')}
              className={`px-4 py-2 rounded-md transition-all ${
                period === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setPeriod('annually')}
              className={`px-4 py-2 rounded-md transition-all ${
                period === 'annually'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Annually <span className="text-xs text-indigo-400">Save 20%</span>
            </button>
          </div>
          
          {period === 'annually' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-indigo-400 mb-4"
            >
              Save up to {calculateSavings(plans[2].price.monthly, plans[2].price.annually)}% with annual billing
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`glass-card overflow-hidden ${
                plan.mostPopular
                  ? 'border-2 border-indigo-500/30 relative md:scale-105 z-10 shadow-lg shadow-indigo-500/10'
                  : 'border border-slate-700/30'
              }`}
            >
              {plan.mostPopular && (
                <div className="bg-indigo-600 text-white text-center py-1 text-sm font-medium">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>
                <p className="text-slate-400 mb-4 h-12">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${period === 'monthly' ? plan.price.monthly : plan.price.annually}
                  </span>
                  <span className="text-slate-400 ml-1">/ month</span>
                  
                  {period === 'annually' && plan.price.monthly > 0 && (
                    <div className="text-sm text-indigo-400 mt-1">
                      Billed as ${(plan.price.annually * 12).toFixed(2)} per year
                    </div>
                  )}
                </div>
                
                <Button 
                  className={`w-full mb-6 ${plan.ctaColor}`}
                >
                  {plan.price.monthly === 0 ? plan.ctaText : plan.ctaText}
                </Button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start">
                      <Check className="h-5 w-5 text-indigo-400 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{feature.name}</span>
                      {feature.tooltip && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-slate-500 ml-1 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-800 text-slate-200 border-slate-700">
                              {feature.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 text-center"
        >
          <button 
            onClick={() => setShowComparison(!showComparison)}
            className="text-indigo-400 hover:text-indigo-300 underline mb-6 inline-flex items-center"
          >
            {showComparison ? 'Hide detailed comparison' : 'View detailed plan comparison'}
          </button>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="glass-card border border-slate-700/30 overflow-x-auto mb-12">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700/30">
                        <th className="p-4 text-slate-300">Feature</th>
                        <th className="p-4 text-slate-300">Free</th>
                        <th className="p-4 text-slate-300">Growth</th>
                        <th className="p-4 text-slate-300">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allFeatures.map((feature, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-slate-800/20' : ''}>
                          <td className="p-4 text-slate-300">{feature.name}</td>
                          <td className="p-4 text-slate-400">{feature.free}</td>
                          <td className="p-4 text-slate-400">{feature.growth}</td>
                          <td className="p-4 text-slate-400">{feature.premium}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-slate-400 mb-4">
            Not sure which plan is right for you?
          </p>
          <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
            Contact Sales
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;