
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RippleButton } from '@/components/ui/ripple-button';
import { ChevronDown } from 'lucide-react';

interface OnboardingHeroProps {
  onStart: () => void;
}

const OnboardingHero: React.FC<OnboardingHeroProps> = ({ onStart }) => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Welcome to Vyanman';
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      {/* Main Content */}
      <div className="text-center max-w-4xl mx-auto">
        {/* Logo/Brand */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-vyanamana-500 to-vyanamana-700 flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-bold text-white">V</span>
          </div>
        </motion.div>

        {/* Typing Animation Headline */}
        <div className="mb-6 h-20 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold gradient-heading">
            {typedText}
            <motion.span
              className="inline-block w-1 h-12 md:h-16 lg:h-20 bg-vyanamana-500 ml-2"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </h1>
        </div>

        {/* Subheading */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          Your AI-powered mental health companion. 
          <span className="block mt-2 text-vyanamana-500 font-medium">
            Personalized support, anytime, anywhere.
          </span>
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <RippleButton
            size="lg"
            onClick={onStart}
            className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-600 hover:from-vyanamana-600 hover:to-vyanamana-700 text-white px-12 py-4 text-lg shadow-2xl hover:shadow-vyanamana-500/25 transition-all duration-300"
          >
            Begin Your Journey
          </RippleButton>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="mt-6 text-sm text-muted-foreground italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
        >
          "Your Mind, Our Mission"
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5, duration: 0.8 }}
      >
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-2">Get Started</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-vyanamana-500" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingHero;
