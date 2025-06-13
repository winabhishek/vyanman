
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialsSection: React.FC = () => {
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const testimonials = [
    {
      text: "Vyanman has transformed my daily mental health routine. The guided meditations are incredibly calming.",
      author: "Sarah K."
    },
    {
      text: "The mood tracker helped me identify patterns I never noticed before. Now I can make better lifestyle choices.",
      author: "Michael T."
    },
    {
      text: "The AI chat companion feels surprisingly human. I use it whenever I need someone to talk to at 2am.",
      author: "Jamie L."
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUpVariants}
        >
          <h2 className="text-3xl font-bold gradient-heading mb-4">
            What Our Users Say
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={fadeInUpVariants}>
              <Card className="glass-card h-full">
                <CardContent className="pt-6 px-5">
                  <p className="italic mb-4">"{testimonial.text}"</p>
                  <p className="text-right text-muted-foreground">— {testimonial.author}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
