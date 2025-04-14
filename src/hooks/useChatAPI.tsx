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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data: ChatApiResponse = await response.json();

      setIsLoading(false);
      return data.message;
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
