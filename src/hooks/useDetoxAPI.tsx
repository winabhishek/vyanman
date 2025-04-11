
import { useState } from 'react';

// Define types for the detox API
export interface DetoxTip {
  id: string;
  title: string;
  content: string;
  icon?: string;
}

export interface ScreenTimeData {
  date: string;
  hours: number;
  category: {
    social: number;
    productivity: number;
    entertainment: number;
    other: number;
  };
}

export const useDetoxAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getDetoxTips = async (): Promise<DetoxTip[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching detox tips from /api/detox');
      
      // In a real implementation, this would be a fetch call
      // const response = await fetch('/api/detox');
      // if (!response.ok) throw new Error('Failed to fetch detox tips');
      // const data = await response.json();
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock response
      const mockTips: DetoxTip[] = [
        {
          id: '1',
          title: 'Set Phone-Free Zones',
          content: 'Designate spaces in your home as phone-free zones, such as your bedroom or dining area.',
          icon: 'home'
        },
        {
          id: '2',
          title: 'Digital Sunset',
          content: 'Turn off screens at least 1 hour before bedtime to improve sleep quality.',
          icon: 'moon'
        },
        {
          id: '3',
          title: 'Notification Detox',
          content: 'Turn off non-essential notifications to reduce distractions and anxiety triggers.',
          icon: 'bell-off'
        },
        {
          id: '4',
          title: 'Mindful Social Media',
          content: 'Before opening any social app, take three deep breaths and set an intention for why you\'re logging in.',
          icon: 'instagram'
        },
        {
          id: '5',
          title: 'App Time Limits',
          content: 'Use your phone\'s built-in screen time tools to set daily limits on apps that tend to drain your energy.',
          icon: 'clock'
        }
      ];
      
      setIsLoading(false);
      return mockTips;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setIsLoading(false);
      return [];
    }
  };

  const getScreenTimeData = async (): Promise<ScreenTimeData[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching screen time data from /api/detox/screentime');
      
      // In a real implementation, this would be a fetch call
      // const response = await fetch('/api/detox/screentime');
      // if (!response.ok) throw new Error('Failed to fetch screen time data');
      // const data = await response.json();
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Generate last 7 days of screen time data
      const mockData: ScreenTimeData[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate random hours between 2-6
        const hours = 2 + Math.random() * 4;
        
        return {
          date: date.toISOString().split('T')[0],
          hours: parseFloat(hours.toFixed(1)),
          category: {
            social: parseFloat((hours * (0.3 + Math.random() * 0.2)).toFixed(1)),
            productivity: parseFloat((hours * (0.2 + Math.random() * 0.1)).toFixed(1)),
            entertainment: parseFloat((hours * (0.25 + Math.random() * 0.15)).toFixed(1)),
            other: parseFloat((hours * (0.1 + Math.random() * 0.1)).toFixed(1))
          }
        };
      });
      
      setIsLoading(false);
      return mockData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setIsLoading(false);
      return [];
    }
  };

  return {
    getDetoxTips,
    getScreenTimeData,
    isLoading,
    error
  };
};
