
import { useState } from 'react';

// Define types for the meditation API
export interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  coverImage: string;
  audioUrl?: string;
}

export const useMeditationAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getMeditations = async (): Promise<Meditation[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching meditations from /api/meditations');
      
      // In a real implementation, this would be a fetch call
      // const response = await fetch('/api/meditations');
      // if (!response.ok) throw new Error('Failed to fetch meditations');
      // const data = await response.json();
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock response
      const mockMeditations: Meditation[] = [
        {
          id: '1',
          title: 'Morning Calm',
          description: 'Start your day with a peaceful morning meditation to center yourself.',
          duration: 300, // 5 minutes
          coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        },
        {
          id: '2',
          title: 'Stress Relief',
          description: 'Unwind and release tension with this guided stress relief session.',
          duration: 600, // 10 minutes
          coverImage: 'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        },
        {
          id: '3',
          title: 'Deep Focus',
          description: 'Enhance your concentration and mental clarity with this focus meditation.',
          duration: 900, // 15 minutes
          coverImage: 'https://images.unsplash.com/photo-1470137237906-d8a4f71e1966?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1lZGl0YXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        },
        {
          id: '4',
          title: 'Sleep Well',
          description: 'Prepare your mind and body for a restful sleep with this calming practice.',
          duration: 1200, // 20 minutes
          coverImage: 'https://images.unsplash.com/photo-1516914589923-f105f1535f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        },
      ];
      
      setIsLoading(false);
      return mockMeditations;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setIsLoading(false);
      return [];
    }
  };

  return {
    getMeditations,
    isLoading,
    error
  };
};
