
import React from 'react';
import { MoodEntry } from '@/types';
import { formatDistanceToNow, format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Heart, Smile, Meh, Frown, AngryIcon, Battery, Zap, Sun } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface MoodHistoryProps {
  moodEntries: MoodEntry[];
}

const MoodHistory: React.FC<MoodHistoryProps> = ({ moodEntries }) => {
  const { language } = useLanguage();

  if (!moodEntries || moodEntries.length === 0) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-vyanmana-100 to-vyanmana-200 dark:from-vyanmana-900/30 dark:to-vyanmana-800/30 flex items-center justify-center">
          <Calendar className="h-12 w-12 text-vyanmana-600 dark:text-vyanmana-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gradient-premium">
          {language === 'en' ? 'Start Your Journey' : 'अपनी यात्रा शुरू करें'}
        </h3>
        <p className="text-muted-foreground mb-6">
          {language === 'en' 
            ? 'No mood entries yet. Start tracking your mood to see your emotional patterns and insights.' 
            : 'अभी तक कोई मूड एंट्री नहीं। अपने भावनात्मक पैटर्न और अंतर्दृष्टि देखने के लिए अपना मूड ट्रैक करना शुरू करें।'
          }
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-vyanmana-600 dark:text-vyanmana-400">
          <TrendingUp className="h-4 w-4" />
          {language === 'en' ? 'Track for insights' : 'अंतर्दृष्टि के लिए ट्रैक करें'}
        </div>
      </motion.div>
    );
  }

  const getMoodIcon = (mood: string) => {
    const iconMap = {
      joyful: Sun,
      happy: Smile,
      content: Heart,
      neutral: Meh,
      sad: Frown,
      anxious: Zap,
      angry: AngryIcon,
      exhausted: Battery,
      stressed: Zap
    };
    return iconMap[mood as keyof typeof iconMap] || Meh;
  };

  const getMoodEmoji = (mood: string) => {
    const emojiMap = {
      joyful: '😄',
      happy: '😊',
      content: '🙂',
      neutral: '😐',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      exhausted: '😴',
      stressed: '😖'
    };
    return emojiMap[mood as keyof typeof emojiMap] || '😐';
  };

  const getMoodColor = (mood: string) => {
    const colorMap = {
      joyful: 'from-yellow-400 to-orange-400',
      happy: 'from-green-400 to-emerald-400',
      content: 'from-blue-400 to-cyan-400',
      neutral: 'from-gray-400 to-slate-400',
      sad: 'from-blue-600 to-indigo-600',
      anxious: 'from-purple-500 to-violet-500',
      angry: 'from-red-500 to-rose-500',
      exhausted: 'from-amber-600 to-orange-600',
      stressed: 'from-purple-500 to-violet-500'
    };
    return colorMap[mood as keyof typeof colorMap] || 'from-gray-400 to-slate-400';
  };

  const getMoodLabel = (mood: string) => {
    if (language === 'en') {
      const labelMap = {
        joyful: 'Joyful',
        happy: 'Happy',
        content: 'Content',
        neutral: 'Neutral',
        sad: 'Sad',
        anxious: 'Anxious',
        angry: 'Angry',
        exhausted: 'Exhausted',
        stressed: 'Stressed'
      };
      return labelMap[mood as keyof typeof labelMap] || mood;
    } else {
      const labelMap = {
        joyful: 'आनंदित',
        happy: 'खुश',
        content: 'संतुष्ट',
        neutral: 'तटस्थ',
        sad: 'उदास',
        anxious: 'चिंतित',
        angry: 'गुस्सा',
        exhausted: 'थका हुआ',
        stressed: 'तनावग्रस्त'
      };
      return labelMap[mood as keyof typeof labelMap] || mood;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vyanmana-400 to-vyanmana-600 flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gradient-premium">
            {language === 'en' ? 'Your Mood Journey' : 'आपकी मूड यात्रा'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === 'en' 
              ? `${moodEntries.length} entries tracked` 
              : `${moodEntries.length} एंट्रीज़ ट्रैक की गईं`
            }
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {moodEntries.map((entry, index) => {
          const IconComponent = getMoodIcon(entry.mood);
          const moodColor = getMoodColor(entry.mood);
          const moodEmoji = getMoodEmoji(entry.mood);
          const moodLabel = getMoodLabel(entry.mood);

          return (
            <motion.div
              key={entry.id}
              className="glass-card p-6 rounded-2xl border border-vyanmana-100 dark:border-vyanmana-900/30 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${moodColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xl">{moodEmoji}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      {moodLabel}
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                    </h4>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(entry.timestamp), 'MMM dd, HH:mm')}
                    </div>
                  </div>
                  
                  {entry.note && (
                    <div className="bg-background/50 rounded-lg p-3 border border-vyanmana-100/50 dark:border-vyanmana-900/20">
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        "{entry.note}"
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-3 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="text-center mt-8 p-4 rounded-xl bg-gradient-to-r from-vyanmana-50 to-amber-50 dark:from-vyanmana-900/20 dark:to-amber-900/20 border border-vyanmana-200/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-vyanmana-700 dark:text-vyanmana-300">
          {language === 'en' 
            ? '🌟 Keep tracking to unlock insights about your emotional patterns!'
            : '🌟 अपने भावनात्मक पैटर्न के बारे में अंतर्दृष्टि अनलॉक करने के लिए ट्रैकिंग जारी रखें!'
          }
        </p>
      </motion.div>
    </div>
  );
};

export default MoodHistory;
