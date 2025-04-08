
import React from 'react';
import MoodTracker from '@/components/MoodTracker';
import MoodHistory from '@/components/MoodHistory';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const MoodTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <motion.div 
      className="container mx-auto max-w-4xl px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold font-heading gradient-heading">{t('nav.mood')}</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          {t('nav.chat')}
        </Button>
      </motion.div>
      
      <div className="space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MoodTracker />
        </motion.section>
        
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">{t('mood.history')}</h2>
          <MoodHistory />
        </motion.section>
      </div>
    </motion.div>
  );
};

export default MoodTrackerPage;
