import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type PricingPeriod = 'monthly' | 'annually';

const PricingSection = () => {
  const [period, setPeriod] = useState<PricingPeriod>('monthly');
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  const plans = [
    {
      name: "Free",
      description: "Perfect for beginners starting their journey",
      price: { monthly: 0, annually: 0 },
      features: [
        "5 journal entries per month",
        "Basic AI insights",
        "Daily prompts",
        "Mobile app access"
      ],
      mostPopular: false
    },
    {
      name: "Growth",
      description: "For committed journalers seeking deeper insights",
      price: { monthly: 9.99, annually: 7.99 },
      features: [
        "Unlimited journal entries",
        "Advanced AI insights",
        "Custom prompts library",
        "Mood and habit tracking",
        "Priority support"
      ],
      mostPopular: true
    },
    {
      name: "Premium",
      description: "For those serious about personal development",
      price: { monthly: 19.99, annually: 16.99 },
      features: [
        "All Growth features",
        "AI coaching recommendations",
        "Advanced analytics dashboard",
        "Goal setting and tracking",
        "Journal exporting",
        "Priority support"
      ],
      mostPopular: false
    }
  ];

  return (
    <section id="pricing" ref={ref} className="section relative z-10 bg-slate-900">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb w-96 h-96 top-20 -left-48 opacity-10"></div>
        <div className="orb w-80 h-80 bottom-20 -right-40 opacity-10"></div>
        
        {/* Constellation effect */}
        {[...Array(8)].map((_, i) => {
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
      
      <div className="container mx-auto relative z-10">
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

          <div className="inline-flex p-1 bg-slate-800/50 rounded-lg backdrop-blur-sm">
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  ? 'border-2 border-indigo-500/30 relative'
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
                <p className="text-slate-400 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    ${period === 'monthly' ? plan.price.monthly : plan.price.annually}
                  </span>
                  <span className="text-slate-400 ml-1">/ month</span>
                </div>
                
                <Button 
                  className={`w-full mb-6 ${
                    plan.mostPopular 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-slate-800/80 border border-slate-700/50 text-white hover:bg-slate-700/80'
                  }`}
                >
                  {plan.price.monthly === 0 ? 'Get Started Free' : 'Start Your Journey'}
                </Button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-indigo-400 mr-2 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{feature}</span>
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