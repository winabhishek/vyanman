
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MoodEntry, Mood } from '@/types';
import { moodAPI } from '@/services/api';

const moodEmojis: Record<Mood, string> = {
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

const moodColorClasses: Record<Mood, string> = {
  joyful: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  happy: 'bg-green-50 text-green-700 dark:bg-green-800 dark:text-green-50',
  content: 'bg-blue-50 text-blue-700 dark:bg-blue-800 dark:text-blue-50',
  neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
  sad: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
  anxious: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  stressed: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  angry: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  exhausted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
};

const MoodHistory: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 bg-muted rounded-md"></div>
        <div className="h-20 bg-muted rounded-md"></div>
        <div className="h-20 bg-muted rounded-md"></div>
      </div>
    );
  }
  
  if (moodEntries.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <p className="text-muted-foreground">No mood entries yet. Start tracking how you feel!</p>
      </div>
    );
  }
  
  // Group entries by date
  const entriesByDate = moodEntries.reduce<Record<string, MoodEntry[]>>((acc, entry) => {
    const date = format(new Date(entry.timestamp), 'yyyy-MM-dd');
    
    if (!acc[date]) {
      acc[date] = [];
    }
    
    acc[date].push(entry);
    return acc;
  }, {});
  
  return (
    <div className="space-y-8">
      {Object.entries(entriesByDate).map(([date, entries]) => (
        <div key={date} className="space-y-2">
          <h3 className="font-medium">
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </h3>
          
          <div className="space-y-3">
            {entries.map((entry) => (
              <div 
                key={entry.id} 
                className="p-4 rounded-lg border bg-card shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" role="img" aria-label={entry.mood}>
                      {moodEmojis[entry.mood]}
                    </span>
                    <div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${moodColorClasses[entry.mood]}`}>
                        {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(entry.timestamp), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
                
                {entry.note && (
                  <div className="mt-3 pl-9">
                    <p className="text-sm">{entry.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoodHistory;
