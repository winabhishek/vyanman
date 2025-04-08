
import React, { useState, useEffect } from 'react';
import { MoodEntry } from '@/types';
import { moodAPI } from '@/services/api';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const moodEmojis: Record<string, string> = {
  joyful: '😄',
  happy: '😊',
  content: '🙂',
  neutral: '😐',
  sad: '😔',
  anxious: '😰',
  stressed: '😫',
  angry: '😠',
  exhausted: '😴'
};

const moodLabelsHindi: Record<string, string> = {
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

// Map mood to numerical value for chart
const moodValues: Record<string, number> = {
  joyful: 5,
  happy: 4,
  content: 3,
  neutral: 2,
  sad: 1,
  anxious: 1,
  stressed: 1,
  angry: 1,
  exhausted: 1
};

const MoodHistory: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language, t } = useLanguage();
  
  useEffect(() => {
    const fetchMoodEntries = async () => {
      try {
        const entries = await moodAPI.getMoodEntries();
        setMoodEntries(entries);
      } catch (error) {
        console.error('Error fetching mood entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMoodEntries();
  }, []);
  
  const formatChartData = () => {
    return moodEntries
      .sort((a, b) => {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      })
      .map(entry => ({
        date: format(new Date(entry.timestamp), 'MMM dd'),
        value: moodValues[entry.mood],
        mood: entry.mood
      }));
  };
  
  const getYAxisLabel = (value: number) => {
    const labels = language === 'en' 
      ? ['', 'Low', '', 'Neutral', '', 'High']
      : ['', 'निम्न', '', 'मध्यम', '', 'उच्च'];
    return labels[value] || '';
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }
  
  if (moodEntries.length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            {t('mood.nodata')}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="h-[250px] w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatChartData()}>
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(value) => getYAxisLabel(value)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-2 bg-card border rounded-md shadow-sm">
                      <p className="text-sm">{data.date}</p>
                      <p className="text-sm font-medium flex items-center">
                        {moodEmojis[data.mood]} {language === 'en' ? data.mood : moodLabelsHindi[data.mood]}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              fill="var(--vyanamana-500)" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
      
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-lg font-medium">{t('mood.history')}</h3>
        <div className="space-y-2">
          {moodEntries.slice(0, 5).map((entry, index) => (
            <motion.div 
              key={entry.id} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Card key={entry.id} className="overflow-hidden glass-card">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                      <div>
                        <p className="font-medium capitalize">
                          {language === 'en' ? entry.mood : moodLabelsHindi[entry.mood as keyof typeof moodLabelsHindi]}
                        </p>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground">{entry.note}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(entry.timestamp), 'MMM dd, yyyy • h:mm a')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MoodHistory;
