
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeartPulse } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <motion.div 
        className="text-center max-w-3xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
          Vyānamana
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Your AI-Powered Mental Wellness Companion
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg h-auto rounded-xl">
            Start Your Journey
            <HeartPulse className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
