
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mood } from '@/types';
import { moodAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const moodEmojis: Record<Mood, { emoji: string; label: string }> = {
  joyful: { emoji: '😄', label: 'Joyful' },
  happy: { emoji: '😊', label: 'Happy' },
  content: { emoji: '🙂', label: 'Content' },
  neutral: { emoji: '😐', label: 'Neutral' },
  sad: { emoji: '😔', label: 'Sad' },
  anxious: { emoji: '😰', label: 'Anxious' },
  stressed: { emoji: '😫', label: 'Stressed' },
  angry: { emoji: '😠', label: 'Angry' },
  exhausted: { emoji: '😴', label: 'Exhausted' }
};

const moodLabelsHindi: Record<Mood, string> = {
  joyful: 'आनंदित',
  happy: 'खुश',
  content: 'संतुष्ट',
  neutral: 'सामान्य',
  sad: 'उदास',
  anxious: 'चिंतित',
  stressed: 'तनावग्रस्त',
  angry: 'गुस्सा',
  exhausted: 'थका हुआ'
};

interface MoodTrackerProps {
  onMoodLogged?: () => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodLogged }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();
  
  const handleSelectMood = (mood: Mood) => {
    setSelectedMood(mood);
  };
  
  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    setIsLogging(true);
    
    try {
      await moodAPI.addMoodEntry(selectedMood, note);
      
      toast({
        title: t('mood.success'),
        description: language === 'en' 
          ? `You're feeling ${moodEmojis[selectedMood].label.toLowerCase()}.`
          : `आप ${moodLabelsHindi[selectedMood]} महसूस कर रहे हैं।`,
      });
      
      // Reset the form
      setSelectedMood(null);
      setNote('');
      
      // Notify parent component if needed
      if (onMoodLogged) {
        onMoodLogged();
      }
    } catch (error) {
      toast({
        title: language === 'en' ? "Failed to log mood" : "मूड लॉग करने में विफल",
        description: language === 'en' 
          ? "There was an error logging your mood. Please try again."
          : "आपका मूड लॉग करने में एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
        variant: "destructive"
      });
    } finally {
      setIsLogging(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <motion.div 
      className="rounded-lg border glass-card bg-card/80 backdrop-blur-sm shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold font-heading">{t('mood.title')}</h3>
          <p className="text-muted-foreground">
            {t('mood.subtitle')}
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-3 md:grid-cols-9 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(moodEmojis).map(([mood, { emoji, label }]) => (
            <motion.div key={mood} variants={itemVariants}>
              <Button
                variant={selectedMood === mood ? "default" : "outline"}
                className={`h-16 text-2xl flex flex-col justify-center items-center p-1 ${selectedMood === mood ? 'border-2 border-vyanamana-500 bg-vyanamana-500/20 text-foreground' : ''}`}
                onClick={() => handleSelectMood(mood as Mood)}
              >
                <span>{emoji}</span>
                <span className="text-xs mt-1">{language === 'en' ? label : moodLabelsHindi[mood as Mood]}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
        
        {selectedMood && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t('mood.note.label')}</h4>
              <Textarea
                placeholder={t('mood.note.placeholder')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none glass-input"
                rows={3}
              />
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full bg-vyanamana-600 hover:bg-vyanamana-700"
                onClick={handleSubmit}
                disabled={isLogging}
              >
                {isLogging ? (language === 'en' ? 'Logging...' : 'लॉगिंग...') : t('mood.submit')}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MoodTracker;
