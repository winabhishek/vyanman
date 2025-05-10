
import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

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

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'https://api.together.xyz/v1/completions';
const CHAT_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY || 'YOUR_API_KEY_HERE';

export const useChatAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Load chat history from local storage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing chat history from localStorage', e);
      }
    }
  }, []);

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const sendMessage = async (message: string): Promise<ChatMessage | null> => {
    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: message,
      role: 'user',
      timestamp: new Date().toISOString()
    };

    // Add user message to chat history
    setChatHistory(prev => [...prev, userMessage]);

    try {
      // First try to send via Supabase
      let response;
      
      if (supabase) {
        try {
          response = await supabase.functions.invoke('chat', {
            body: { message, userId: 'anonymous' }
          });
          
          if (response.error) {
            throw new Error(response.error.message);
          }
        } catch (err) {
          console.log('Supabase chat function failed, falling back to Together API', err);
        }
      }
      
      // If Supabase failed or isn't available, use Together API directly
      if (!response?.data) {
        response = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHAT_API_KEY}`
          },
          body: JSON.stringify({
            model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            prompt: `<|im_start|>user\nI'm feeling stressed and anxious. ${message}<|im_end|>\n<|im_start|>assistant\n`,
            max_tokens: 800,
            temperature: 0.7,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ['<|im_end|>']
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        response = {
          data: {
            message: {
              id: uuidv4(),
              content: data.choices[0].text.trim(),
              role: 'assistant',
              timestamp: new Date().toISOString()
            }
          }
        };
      }

      const botMessage = response.data.message;

      // Add bot message to chat history
      setChatHistory(prev => [...prev, botMessage]);

      setIsLoading(false);
      return botMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      // Create a fallback error message
      const errorBotMessage: ChatMessage = {
        id: uuidv4(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      // Add error message to chat history
      setChatHistory(prev => [...prev, errorBotMessage]);
      
      setIsLoading(false);
      return errorBotMessage;
    }
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  };

  return {
    sendMessage,
    clearChatHistory,
    chatHistory,
    isLoading,
    error
  };
};
