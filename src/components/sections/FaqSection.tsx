import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What makes Bean Journey different from other journaling apps?",
    answer: "Bean Journey uniquely combines the proven practice of journaling with AI technology to provide personalized insights and recommendations. Unlike traditional journaling apps, we help you identify patterns, track your progress, and offer suggestions to improve your well-being and productivity."
  },
  {
    question: "Is my journal data private and secure?",
    answer: "Absolutely. We take privacy extremely seriously. Your journal entries are encrypted end-to-end, and we never access your personal content without explicit permission. Our AI processes your data locally when possible, and all cloud processing is done with strict privacy measures in place."
  },
  {
    question: "Can I export my journal entries?",
    answer: "Yes, Premium plan users can export their journal entries in various formats including PDF, plain text, and markdown. This allows you to back up your journals or print them for personal archives."
  },
  {
    question: "How does the AI journaling assistant work?",
    answer: "Our AI assistant analyzes your writing patterns, sentiment, and topics to provide personalized insights. It can suggest prompts based on your previous entries, identify mood patterns over time, and offer gentle suggestions for personal growth. The AI is designed to be helpful without being intrusive."
  },
  {
    question: "Do I need to journal every day for this to be effective?",
    answer: "While consistent journaling yields the best insights, Bean Journey is designed to be flexible. You can journal daily, weekly, or whenever inspiration strikes. Our AI adapts to your schedule and provides value regardless of your journaling frequency."
  },
  {
    question: "Can I use Bean Journey on multiple devices?",
    answer: "Yes, Bean Journey synchronizes across all your devices. Whether you're using our mobile app on iOS or Android, or our web application on your desktop, your journal entries and insights are always up-to-date."
  }
];

const FaqItem = ({ faq, index }: { faq: typeof faqs[0], index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="border-b border-slate-700/50 py-4"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-lg font-medium text-white">{faq.question}</h3>
        <ChevronDown 
          className={`h-5 w-5 text-indigo-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-slate-300">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FaqSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <section id="faq" ref={ref} className="section relative z-10 bg-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-slate-300">
            Everything you need to know about Bean Journey.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto glass-card p-8 border border-slate-700/20">
          {faqs.map((faq, index) => (
            <FaqItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;