
import React from 'react';
import { motion } from 'framer-motion';
import MoodTrackerCard from './MoodTrackerCard';
import ChatCompanionCard from './ChatCompanionCard';
import MeditationCard from './MeditationCard';

interface FeatureCardsProps {
  isMusicPlaying: boolean;
  toggleMusic: (e: React.MouseEvent) => void;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ isMusicPlaying, toggleMusic }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-12">
      <motion.div 
        className="max-w-6xl mx-auto px-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
          Tools for Your Mental Wellbeing
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mood Tracker Card */}
          <motion.div variants={item}>
            <MoodTrackerCard />
          </motion.div>

          {/* AI Chat Companion Card */}
          <motion.div variants={item}>
            <ChatCompanionCard />
          </motion.div>

          {/* Meditation & Breathing Tools Card */}
          <motion.div variants={item}>
            <MeditationCard 
              isMusicPlaying={isMusicPlaying} 
              toggleMusic={toggleMusic} 
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default FeatureCards;
