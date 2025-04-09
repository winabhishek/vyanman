
import { MoodEntry, Mood } from '../types';

// Mock delay function to simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const moodAPI = {
  // Get all mood entries for the current user
  getMoodEntries: async (): Promise<MoodEntry[]> => {
    await delay(500);
    const storedMoods = localStorage.getItem('vyanamana-moods');
    return storedMoods ? JSON.parse(storedMoods) : [];
  },
  
  // Add a new mood entry
  addMoodEntry: async (mood: Mood, note?: string): Promise<MoodEntry> => {
    await delay(500);
    
    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      userId: 'current-user', // In a real app, this would be the actual user ID
      mood,
      note,
      timestamp: new Date()
    };
    
    // Save to localStorage
    const storedMoods = localStorage.getItem('vyanamana-moods');
    const moods = storedMoods ? JSON.parse(storedMoods) : [];
    moods.push(newEntry);
    localStorage.setItem('vyanamana-moods', JSON.stringify(moods));
    
    return newEntry;
  },
  
  // Get mood analytics (new method)
  getMoodAnalytics: async (): Promise<{
    averageMood: number;
    moodCounts: Record<Mood, number>;
    mostFrequentMood: Mood;
  }> => {
    await delay(700);
    
    const storedMoods = localStorage.getItem('vyanamana-moods');
    const moods: MoodEntry[] = storedMoods ? JSON.parse(storedMoods) : [];
    
    if (moods.length === 0) {
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
    
    moods.forEach(entry => {
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
    
    const totalMoodValue = moods.reduce((sum, entry) => sum + moodValues[entry.mood], 0);
    const averageMood = totalMoodValue / moods.length;
    
    return {
      averageMood,
      moodCounts,
      mostFrequentMood
    };
  }
};
