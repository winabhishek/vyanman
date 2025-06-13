
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RippleButton } from '@/components/ui/ripple-button';
import { Link } from 'react-router-dom';
import FloatingShape from '@/components/FloatingShape';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-vyanamana-900/20 to-transparent dark:from-vyanamana-950/40 -z-10" />
      
      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-vyanamana-500/20 dark:bg-vyanamana-400/10"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * -50 - 20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            className="md:max-w-[60%] text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-heading leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your AI-Powered <br /> Mental Wellness Companion
            </motion.h1>
            
            <motion.p
              className="text-lg text-muted-foreground mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="vyanman-brand">Vyanman</span> combines AI chat therapy, mood tracking, and guided meditations 
              to support your mental health journey. Breathe, reflect, and grow with us.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap justify-center md:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/onboarding">
                <RippleButton 
                  size="lg"
                  className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-600 hover:from-vyanamana-600 hover:to-vyanamana-700 shadow-md hover:shadow-lg transition-all"
                >
                  Get Started
                </RippleButton>
              </Link>
              
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-vyanamana-400/30 hover:bg-vyanamana-500/10">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <FloatingShape size={280} className="ml-auto" />
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1,
            delay: 1.2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="flex flex-col items-center mt-12">
            <p className="text-sm text-muted-foreground mb-2">Scroll to explore</p>
            <div className="w-6 h-10 border-2 border-vyanamana-400/50 rounded-full flex justify-center">
              <motion.div 
                className="w-1.5 h-1.5 bg-vyanamana-400 rounded-full mt-2"
                animate={{ y: [0, 15, 0] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
