
import React, { useState, useEffect } from 'react';
import MoodTracker from '@/components/MoodTracker';
import MoodHistory from '@/components/MoodHistory';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { moodAPI } from '@/services';
import { MoodEntry } from '@/types';

const MoodTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchMoodEntries = async () => {
    try {
      setLoading(true);
      const entries = await moodAPI.getMoodEntries();
      setMoodEntries(entries);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMoodEntries();
  }, []);
  
  const handleMoodLogged = () => {
    fetchMoodEntries();
  };
  
  return (
    <motion.div 
      className="container mx-auto max-w-4xl px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex justify-between items-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading gradient-heading mb-2">{t('nav.mood')}</h1>
          <p className="text-muted-foreground">Track your emotional journey and discover patterns</p>
        </div>
        <Button 
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 bg-gradient-premium shadow-premium hover:shadow-lg"
        >
          <MessageCircle className="h-4 w-4" />
          {t('nav.chat')}
        </Button>
      </motion.div>
      
      <div className="space-y-12">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-radial from-lavender/10 to-transparent dark:from-deepPurple/5 -z-10 rounded-3xl blur-3xl"></div>
          <MoodTracker onMoodLogged={handleMoodLogged} />
        </motion.section>
        
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gradient-premium">{t('mood.history')}</h2>
          <div className="glass-card p-6 rounded-2xl">
            {loading ? (
              <p>Loading mood history...</p>
            ) : (
              <MoodHistory moodEntries={moodEntries} />
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default MoodTrackerPage;
