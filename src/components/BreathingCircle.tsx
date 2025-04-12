
import React from 'react';
import { motion } from 'framer-motion';

interface BreathingCircleProps {
  duration?: number;
  size?: number;
  paused?: boolean;
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({ 
  duration = 7,
  size = 200,
  paused = false
}) => {
  const breathingVariants = {
    inhale: {
      scale: 1.5,
      opacity: 0.3,
      transition: {
        duration: duration / 2,
        ease: "easeInOut"
      }
    },
    exhale: {
      scale: 1,
      opacity: 0.7,
      transition: {
        duration: duration / 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute rounded-full bg-vyanamana-100 dark:bg-vyanamana-900/30"
        animate={paused ? undefined : { scale: [1, 1.5, 1.5, 1, 1], opacity: [0.7, 0.3, 0.3, 0.7, 0.7] }}
        transition={paused ? undefined : {
          duration,
          repeat: Infinity,
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        style={{ width: '95%', height: '95%' }}
      />
      <motion.div
        className="absolute rounded-full bg-vyanamana-200 dark:bg-vyanamana-800/40"
        animate={paused ? undefined : { scale: [1, 1.35, 1.35, 1, 1], opacity: [0.8, 0.4, 0.4, 0.8, 0.8] }}
        transition={paused ? undefined : {
          duration,
          repeat: Infinity,
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        style={{ width: '75%', height: '75%' }}
      />
      <motion.div
        className="absolute rounded-full bg-vyanamana-300 dark:bg-vyanamana-700/50"
        animate={paused ? undefined : { scale: [1, 1.2, 1.2, 1, 1], opacity: [0.9, 0.5, 0.5, 0.9, 0.9] }}
        transition={paused ? undefined : {
          duration,
          repeat: Infinity,
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        style={{ width: '55%', height: '55%' }}
      />
      <motion.div
        className="absolute rounded-full bg-vyanamana-400 dark:bg-vyanamana-600/60"
        animate={paused ? undefined : { scale: [1, 1.1, 1.1, 1, 1], opacity: [1, 0.6, 0.6, 1, 1] }}
        transition={paused ? undefined : {
          duration,
          repeat: Infinity,
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        style={{ width: '35%', height: '35%' }}
      />
      <div className="relative z-10 text-center text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">
        {paused ? 'Paused' : 'Breathe'}
      </div>
    </div>
  );
};

export default BreathingCircle;
