
import { useState } from 'react';

// Define types for the API
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

interface ChatApiResponse {
  message: ChatMessage;
}

export const useChatAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (message: string): Promise<ChatMessage | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulating API call
      console.log(`Sending message to /api/chat: ${message}`);
      
      // In a real implementation, this would be a fetch call
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message })
      // });
      
      // if (!response.ok) throw new Error('Failed to send message');
      // const data: ChatApiResponse = await response.json();
      
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockResponse: ChatMessage = {
        id: Date.now().toString(),
        content: `This is a simulated response to: "${message}"`,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      setIsLoading(false);
      return mockResponse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      setIsLoading(false);
      return null;
    }
  };

  return {
    sendMessage,
    isLoading,
    error
  };
};
