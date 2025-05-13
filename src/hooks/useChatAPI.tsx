
import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  // Load chat history from local storage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing chat history from localStorage', e);
        // Clear corrupted data
        localStorage.removeItem('chatHistory');
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
      // First try to send via Supabase edge function
      let response;
      
      if (supabase) {
        try {
          console.log('Attempting to call Supabase edge function...');
          response = await supabase.functions.invoke('chat', {
            body: { 
              content: message, 
              language: detectLanguage(message) 
            }
          });
          
          if (response.error) {
            console.error('Supabase function error:', response.error);
            throw new Error(response.error.message || 'Supabase function failed');
          }
          
          console.log('Supabase response:', response);
        } catch (err) {
          console.log('Supabase chat function failed, falling back to Together API', err);
          // Continue to fallback
        }
      }
      
      // If Supabase failed or isn't available, use Together API directly
      if (!response?.data) {
        console.log('Using Together API fallback...');
        const togetherResponse = await fetch(CHAT_API_URL, {
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

        if (!togetherResponse.ok) {
          throw new Error(`Failed to send message: ${togetherResponse.status} ${togetherResponse.statusText}`);
        }

        const data = await togetherResponse.json();
        
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
      setRetryCount(0); // Reset retry count on success
      setIsLoading(false);
      return botMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      // Implement retry logic for transient errors
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Try again
        setIsLoading(false);
        return sendMessage(message);
      }
      
      // Create a fallback error message after all retries have failed
      const errorBotMessage: ChatMessage = {
        id: uuidv4(),
        content: detectLanguage(message) === 'hi' 
          ? "मुझे खेद है, मुझे अभी कनेक्शन में समस्या हो रही है। कृपया बाद में फिर से प्रयास करें।"
          : "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      // Add error message to chat history
      setChatHistory(prev => [...prev, errorBotMessage]);
      
      // Show toast notification
      toast({
        title: detectLanguage(message) === 'hi' ? "कनेक्शन त्रुटि" : "Connection Error",
        description: detectLanguage(message) === 'hi' 
          ? "AI सेवा से कनेक्ट करने में समस्या। ऑफलाइन मोड में चल रहा है।"
          : "Problem connecting to AI service. Running in offline mode.",
        variant: "destructive",
      });
      
      setRetryCount(0); // Reset retry count
      setIsLoading(false);
      return errorBotMessage;
    }
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  };

  // Helper to detect language
  const detectLanguage = (text: string): 'en' | 'hi' => {
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(text) ? 'hi' : 'en';
  };

  return {
    sendMessage,
    clearChatHistory,
    chatHistory,
    isLoading,
    error
  };
};
