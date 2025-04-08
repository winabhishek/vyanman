
import React, { useState, useEffect } from 'react';
import { MoodEntry } from '@/types';
import { moodAPI } from '@/services/api';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No mood entries yet. Start logging your mood to see your history.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatChartData()}>
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={(value) => {
                const labels = ['', 'Low', '', 'Neutral', '', 'High'];
                return labels[value] || '';
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-2 bg-card border rounded-md shadow-sm">
                      <p className="text-sm">{data.date}</p>
                      <p className="text-sm font-medium flex items-center">
                        {moodEmojis[data.mood]} {data.mood}
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
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Recent Entries</h3>
        <div className="space-y-2">
          {moodEntries.slice(0, 5).map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                    <div>
                      <p className="font-medium capitalize">{entry.mood}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodHistory;
