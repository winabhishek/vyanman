
import React from 'react';
import { motion } from 'framer-motion';

const BreathingCircle: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <motion.div
        className="absolute rounded-full bg-blue-100 dark:bg-blue-900/30"
        animate={{
          scale: [1, 1.5, 1.5, 1, 1],
          opacity: [0.7, 0.3, 0.3, 0.7, 0.7]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        style={{ width: '80%', height: '80%' }}
      />
      <motion.div
        className="absolute rounded-full bg-indigo-200 dark:bg-indigo-800/40"
        animate={{
          scale: [1, 1.25, 1.25, 1, 1],
          opacity: [0.7, 0.5, 0.5, 0.7, 0.7]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        style={{ width: '60%', height: '60%' }}
      />
      <motion.div
        className="absolute rounded-full bg-violet-300 dark:bg-violet-700/50"
        animate={{
          scale: [1, 1.1, 1.1, 1, 1],
          opacity: [0.8, 0.6, 0.6, 0.8, 0.8]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
        style={{ width: '40%', height: '40%' }}
      />
      <div className="relative text-center text-sm font-medium text-gray-700 dark:text-gray-300">
        Breathe
      </div>
    </div>
  );
};

export default BreathingCircle;
