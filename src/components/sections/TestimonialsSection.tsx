import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    content: "Bean Journey has completely transformed how I approach my days. The AI insights are scary accurate and have helped me identify patterns I never noticed before.",
    author: "Sarah Johnson",
    role: "Product Designer",
    stars: 5
  },
  {
    content: "I've tried many journaling apps, but this is the first one that has kept me consistent for over 6 months. The AI prompts are so thoughtful!",
    author: "Michael Chen",
    role: "Software Engineer",
    stars: 5
  },
  {
    content: "As a therapist, I recommend Bean Journey to my clients. The mindfulness features combined with AI guidance create a powerful tool for self-reflection.",
    author: "Dr. Emily Rodriguez",
    role: "Clinical Psychologist",
    stars: 5
  },
  {
    content: "The productivity insights have helped me optimize my workflow in ways I never expected. I'm getting more done while feeling less stressed.",
    author: "James Wilson",
    role: "Marketing Director",
    stars: 5
  }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card p-6 relative"
    >
      <div className="absolute top-6 right-6 text-indigo-400">
        <Quote size={24} />
      </div>
      
      <div className="flex text-yellow-400 mb-4">
        {[...Array(testimonial.stars)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>
      
      <p className="text-slate-300 mb-6">{testimonial.content}</p>
      
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-indigo-600/30 mr-3 flex items-center justify-center">
          <span className="text-indigo-300 font-semibold">
            {testimonial.author.charAt(0)}
          </span>
        </div>
        <div>
          <h4 className="font-medium text-white">{testimonial.author}</h4>
          <p className="text-sm text-slate-400">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <section id="testimonials" ref={ref} className="section relative z-10 bg-slate-900">
      {/* Add floating stars */}
      {[...Array(30)].map((_, i) => (
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
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          style={{ opacity, y }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Loved by Journal <span className="text-gradient">Enthusiasts</span>
          </h2>
          <p className="text-lg text-slate-300">
            Join thousands of users who have transformed their journaling practice with Bean Journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;