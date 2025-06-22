
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { moodAPI } from '@/services';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mood } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Smile, Meh, Frown, AngryIcon, Battery, Zap, Sun } from 'lucide-react';

const MoodTracker: React.FC<{ onMoodLogged: () => void }> = ({ onMoodLogged }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { language, t } = useLanguage();

  const moodOptions = [
    {
      mood: 'joyful' as Mood,
      emoji: '😄',
      icon: Sun,
      label: language === 'en' ? 'Joyful' : 'आनंदित',
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      description: language === 'en' ? 'Feeling amazing!' : 'बहुत खुश!'
    },
    {
      mood: 'happy' as Mood,
      emoji: '😊',
      icon: Smile,
      label: language === 'en' ? 'Happy' : 'खुश',
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      description: language === 'en' ? 'Feeling good' : 'अच्छा लग रहा'
    },
    {
      mood: 'content' as Mood,
      emoji: '🙂',
      icon: Heart,
      label: language === 'en' ? 'Content' : 'संतुष्ट',
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: language === 'en' ? 'Peaceful' : 'शांत'
    },
    {
      mood: 'neutral' as Mood,
      emoji: '😐',
      icon: Meh,
      label: language === 'en' ? 'Neutral' : 'तटस्थ',
      color: 'from-gray-400 to-slate-400',
      bgColor: 'bg-gray-100 dark:bg-gray-900/20',
      description: language === 'en' ? 'Just okay' : 'ठीक है'
    },
    {
      mood: 'sad' as Mood,
      emoji: '😢',
      icon: Frown,
      label: language === 'en' ? 'Sad' : 'उदास',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: language === 'en' ? 'Feeling down' : 'उदास लग रहा'
    },
    {
      mood: 'anxious' as Mood,
      emoji: '😰',
      icon: Zap,
      label: language === 'en' ? 'Anxious' : 'चिंतित',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: language === 'en' ? 'Feeling worried' : 'परेशान'
    },
    {
      mood: 'angry' as Mood,
      emoji: '😠',
      icon: AngryIcon,
      label: language === 'en' ? 'Angry' : 'गुस्सा',
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      description: language === 'en' ? 'Feeling frustrated' : 'गुस्से में'
    },
    {
      mood: 'exhausted' as Mood,
      emoji: '😴',
      icon: Battery,
      label: language === 'en' ? 'Exhausted' : 'थका हुआ',
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
      description: language === 'en' ? 'Feeling drained' : 'थकान'
    }
  ];

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: language === 'en' ? 'Please select a mood' : 'कृपया मूड चुनें',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await moodAPI.addMoodEntry(selectedMood, note);
      toast({
        title: language === 'en' ? '🎉 Mood logged successfully!' : '🎉 मूड सफलतापूर्वक दर्ज किया गया!',
        description: language === 'en' ? 'Keep tracking to see your progress' : 'अपनी प्रगति देखने के लिए ट्रैकिंग जारी रखें'
      });
      
      // Reset form
      setSelectedMood(null);
      setNote('');
      onMoodLogged();
    } catch (error) {
      console.error('Error logging mood:', error);
      toast({
        title: language === 'en' ? 'Error' : 'त्रुटि',
        description: language === 'en' ? 'Failed to log mood. Please try again.' : 'मूड लॉग करने में विफल। कृपया पुनः प्रयास करें।',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="glass-card p-8 rounded-3xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border border-vyanmana-200/30 dark:border-vyanmana-800/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-vyanmana-400 to-vyanmana-600 mb-4"
        >
          <Heart className="h-8 w-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold gradient-heading mb-2">
          {language === 'en' ? 'How are you feeling today?' : 'आज आप कैसा महसूस कर रहे हैं?'}
        </h2>
        <p className="text-muted-foreground">
          {language === 'en' ? 'Track your emotional journey and discover patterns' : 'अपनी भावनात्मक यात्रा को ट्रैक करें और पैटर्न खोजें'}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {moodOptions.map((option, index) => {
          const IconComponent = option.icon;
          const isSelected = selectedMood === option.mood;
          
          return (
            <motion.button
              key={option.mood}
              onClick={() => handleMoodSelect(option.mood)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                isSelected 
                  ? `border-vyanmana-400 ${option.bgColor} shadow-lg` 
                  : 'border-gray-200 dark:border-gray-700 hover:border-vyanmana-300 hover:shadow-md'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{option.emoji}</div>
                <div className={`w-8 h-8 mx-auto mb-3 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{option.label}</h3>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
              
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-vyanmana-400/20 to-vyanmana-600/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-3 text-gradient-premium">
                {language === 'en' ? '💭 Tell us more about your mood (optional)' : '💭 अपने मूड के बारे में और बताएं (वैकल्पिक)'}
              </label>
              <Textarea
                placeholder={language === 'en' 
                  ? "What's on your mind? Share your thoughts, experiences, or anything that influenced your mood today..." 
                  : "आपके मन में क्या है? अपने विचार, अनुभव, या आज आपके मूड को प्रभावित करने वाली कोई भी बात साझा करें..."
                }
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[100px] resize-none border-vyanmana-200 dark:border-vyanmana-800 focus:border-vyanmana-400 focus:ring-vyanmana-400"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-vyanmana-500 to-vyanmana-600 hover:from-vyanmana-600 hover:to-vyanmana-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting 
                  ? (language === 'en' ? '⏳ Saving...' : '⏳ सेव हो रहा है...') 
                  : (language === 'en' ? '🎯 Log My Mood' : '🎯 मेरा मूड लॉग करें')
                }
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedMood && (
        <motion.div 
          className="text-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm">
            {language === 'en' 
              ? '✨ Select a mood above to get started' 
              : '✨ शुरू करने के लिए ऊपर से एक मूड चुनें'
            }
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MoodTracker;
