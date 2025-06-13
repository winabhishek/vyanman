
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
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

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-3xl mx-auto text-center glass-card p-8 md:p-12 rounded-2xl bg-gradient-to-r from-vyanamana-900/30 to-vyanamana-800/30"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUpVariants}
        >
          <h2 className="text-3xl font-bold gradient-heading mb-4">
            Begin Your Wellness Journey Today
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Take the first step toward better mental health and emotional balance with our AI-powered companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/onboarding">
              <Button size="lg" className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-600 hover:from-vyanamana-600 hover:to-vyanamana-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </Link>
            <Link to="/chat">
              <Button size="lg" variant="outline" className="border-vyanamana-400/50 hover:bg-vyanamana-500/10">
                Try Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
