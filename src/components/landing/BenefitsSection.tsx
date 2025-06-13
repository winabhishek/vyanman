
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, HeartPulse, Brain, Smile } from 'lucide-react';

const BenefitsSection: React.FC = () => {
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

  const benefits = [
    {
      icon: <MessageCircle className="h-8 w-8 text-vyanamana-500" />,
      title: "24/7 Support",
      description: "Our AI companion is always available for a supportive conversation whenever you need it."
    },
    {
      icon: <HeartPulse className="h-8 w-8 text-vyanamana-500" />,
      title: "Mindful Moments",
      description: "Guided breathing and meditation exercises help reduce stress and anxiety."
    },
    {
      icon: <Brain className="h-8 w-8 text-vyanamana-500" />,
      title: "Mental Clarity",
      description: "Digital detox tools help clear mental fog and improve focus."
    },
    {
      icon: <Smile className="h-8 w-8 text-vyanamana-500" />,
      title: "Emotional Insights",
      description: "Track your moods to discover patterns and improve emotional awareness."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUpVariants}
        >
          <h2 className="text-3xl font-bold gradient-heading mb-4">
            How <span className="vyanman-brand">Vyanman</span> Helps You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered tools work together to support your mental wellbeing journey
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} variants={fadeInUpVariants}>
              <Card className="glass-card h-full">
                <CardContent className="pt-6 px-5 text-center">
                  <div className="mb-4 inline-flex p-3 rounded-full bg-vyanamana-500/10">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
