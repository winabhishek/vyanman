
import { supabase } from '../supabaseClient';
import { MoodEntry, Mood } from '../types';

export const moodAPI = {
  // Get all mood entries for the current user
  getMoodEntries: async (): Promise<MoodEntry[]> => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('User not authenticated');
      }
      
      // Call our edge function
      const { data, error } = await supabase.functions.invoke('moods', {
        method: 'GET',
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      
      // Fallback to localStorage
      const storedMoods = localStorage.getItem('vyanman-moods');
      return storedMoods ? JSON.parse(storedMoods) : [];
    }
  },
  
  // Add a new mood entry
  addMoodEntry: async (mood: Mood, note?: string): Promise<MoodEntry> => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('User not authenticated');
      }
      
      // Call our edge function
      const { data, error } = await supabase.functions.invoke('moods', {
        body: { mood_type: mood, note },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error adding mood entry:', error);
      
      // Fallback to localStorage
      const newEntry: MoodEntry = {
        id: `mood-${Date.now()}`,
        userId: 'current-user',
        mood,
        note,
        timestamp: new Date()
      };
      
      // Save to localStorage
      const storedMoods = localStorage.getItem('vyanman-moods');
      const moods = storedMoods ? JSON.parse(storedMoods) : [];
      moods.push(newEntry);
      localStorage.setItem('vyanman-moods', JSON.stringify(moods));
      
      return newEntry;
    }
  },
  
  // Get mood analytics (new method)
  getMoodAnalytics: async (): Promise<{
    averageMood: number;
    moodCounts: Record<Mood, number>;
    mostFrequentMood: Mood;
  }> => {
    try {
      const entries = await moodAPI.getMoodEntries();
      
      if (entries.length === 0) {
        return {
          averageMood: 2.5, // Neutral
          moodCounts: {
            joyful: 0,
            happy: 0,
            content: 0,
            neutral: 0,
            sad: 0,
            anxious: 0,
            stressed: 0,
            angry: 0,
            exhausted: 0
          },
          mostFrequentMood: 'neutral'
        };
      }
      
      // Calculate mood counts
      const moodCounts: Record<Mood, number> = {
        joyful: 0,
        happy: 0,
        content: 0,
        neutral: 0,
        sad: 0,
        anxious: 0,
        stressed: 0,
        angry: 0,
        exhausted: 0
      };
      
      entries.forEach(entry => {
        moodCounts[entry.mood]++;
      });
      
      // Calculate most frequent mood
      const mostFrequentMood = Object.entries(moodCounts)
        .reduce((max, [mood, count]) => count > max.count ? { mood: mood as Mood, count } : max, { mood: 'neutral' as Mood, count: 0 })
        .mood;
      
      // Calculate average mood (simple implementation)
      const moodValues: Record<Mood, number> = {
        joyful: 5,
        happy: 4,
        content: 3.5,
        neutral: 2.5,
        sad: 1.5,
        anxious: 1,
        stressed: 1,
        angry: 0.5,
        exhausted: 1
      };
      
      const totalMoodValue = entries.reduce((sum, entry) => sum + moodValues[entry.mood], 0);
      const averageMood = totalMoodValue / entries.length;
      
      return {
        averageMood,
        moodCounts,
        mostFrequentMood
      };
    } catch (error) {
      console.error('Error getting mood analytics:', error);
      return {
        averageMood: 2.5,
        moodCounts: {
          joyful: 0,
          happy: 0,
          content: 0,
          neutral: 0,
          sad: 0,
          anxious: 0,
          stressed: 0,
          angry: 0,
          exhausted: 0
        },
        mostFrequentMood: 'neutral'
      };
    }
  }
};
