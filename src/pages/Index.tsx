
import React from 'react';
import LandingPage from './LandingPage';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <LandingPage />
    </motion.div>
  );
};

export default Index;
