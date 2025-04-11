
import { useState } from 'react';

// Define types for the mood API
export interface MoodEntry {
  id: string;
  mood: string;
  note?: string;
  timestamp: string;
}

export const useMoodAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveMood = async (mood: string, note?: string): Promise<MoodEntry | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Saving mood to /api/mood: ${mood}, Note: ${note || 'None'}`);
      
      // In a real implementation, this would be a fetch call
      // const response = await fetch('/api/mood', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ mood, note })
      // });
      
      // if (!response.ok) throw new Error('Failed to save mood');
      // const data = await response.json();
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock response
      const mockEntry: MoodEntry = {
        id: Date.now().toString(),
        mood,
        note,
        timestamp: new Date().toISOString()
      };
      
      setIsLoading(false);
      return mockEntry;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setIsLoading(false);
      return null;
    }
  };

  const getMoodHistory = async (): Promise<MoodEntry[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching mood history from /api/mood');
      
      // In a real implementation, this would be a fetch call
      // const response = await fetch('/api/mood');
      // if (!response.ok) throw new Error('Failed to fetch mood history');
      // const data = await response.json();
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Mock response with 7 days of moods
      const mockHistory: MoodEntry[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const moods = ['happy', 'calm', 'anxious', 'sad', 'energetic'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        
        return {
          id: `mock-${i}`,
          mood: randomMood,
          note: i % 2 === 0 ? `Note for ${randomMood} mood` : undefined,
          timestamp: date.toISOString()
        };
      });
      
      setIsLoading(false);
      return mockHistory;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setIsLoading(false);
      return [];
    }
  };

  return {
    saveMood,
    getMoodHistory,
    isLoading,
    error
  };
};
