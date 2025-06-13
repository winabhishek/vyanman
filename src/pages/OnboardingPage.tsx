
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import OnboardingHero from '@/components/onboarding/OnboardingHero';
import OnboardingFeatures from '@/components/onboarding/OnboardingFeatures';
import OnboardingAIAgent from '@/components/onboarding/OnboardingAIAgent';
import OnboardingCTA from '@/components/onboarding/OnboardingCTA';
import { useTheme } from '@/contexts/ThemeContext';

const OnboardingPage: React.FC = () => {
  const { theme } = useTheme();
  const [currentSection, setCurrentSection] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
    setCurrentSection(1);
  };

  const handleNext = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // Auto-advance sections after delay (optional)
  useEffect(() => {
    if (hasStarted && currentSection > 0 && currentSection < 3) {
      const timer = setTimeout(() => {
        handleNext();
      }, 8000); // 8 seconds per section
      
      return () => clearTimeout(timer);
    }
  }, [currentSection, hasStarted]);

  return (
    <>
      <Helmet>
        <title>Welcome to Vyanman - Your AI Mental Health Companion</title>
        <meta name="description" content="Start your mental wellness journey with Vyanman's AI-powered support, mood tracking, and personalized guidance." />
      </Helmet>
      
      <div className={`min-h-screen bg-gradient-to-br from-background via-background/95 to-vyanamana-950/20 relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-vyanamana-500/5 via-transparent to-vyanamana-800/10 pointer-events-none" />
        
        {/* Animated Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-vyanamana-400/20 dark:bg-vyanamana-300/10"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <AnimatePresence mode="wait">
          {currentSection === 0 && (
            <OnboardingHero key="hero" onStart={handleStart} />
          )}
          
          {currentSection === 1 && (
            <OnboardingFeatures 
              key="features" 
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          
          {currentSection === 2 && (
            <OnboardingAIAgent 
              key="ai-agent" 
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          
          {currentSection === 3 && (
            <OnboardingCTA 
              key="cta" 
              onPrevious={handlePrevious}
            />
          )}
        </AnimatePresence>

        {/* Progress Indicator */}
        {hasStarted && (
          <motion.div
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex space-x-2 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-full px-4 py-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    step <= currentSection 
                      ? 'bg-vyanamana-500 scale-110' 
                      : 'bg-white/30 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default OnboardingPage;
