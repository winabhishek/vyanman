
import { supabase } from '../supabaseClient';
import { Message } from '../types';

// Mock delay function to simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to detect language (basic)
const detectLanguage = (text: string): 'en' | 'hi' => {
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text) ? 'hi' : 'en';
};

export const chatAPI = {
  // Get all messages for the current user
  getMessages: async (): Promise<Message[]> => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      // Convert to Message type
      return messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.is_bot ? 'bot' : 'user',
        timestamp: new Date(msg.created_at),
        sentiment: msg.sentiment || { score: 3, label: 'neutral' }
      }));
    } catch (error) {
      console.error('Error in getMessages:', error);
      
      // Fallback to localStorage if Supabase fails
      const storedMessages = localStorage.getItem('vyanman-messages');
      return storedMessages ? JSON.parse(storedMessages) : [];
    }
  },

  // Send a message and get a response
  sendMessage: async (content: string, language: string = 'en'): Promise<Message> => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error('User not authenticated');
      }

      // Call our edge function
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { content, language },
      });

      if (error) {
        throw error;
      }

      // Get messages to ensure they're up to date
      await chatAPI.getMessages();

      return data.message;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Fallback to localStorage
      const userMessage: Message = {
        id: `user-msg-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
        sentiment: { score: 3, label: 'neutral' }
      };

      const botMessage: Message = {
        id: `bot-msg-${Date.now() + 1}`,
        content: "I'm here for you. (Offline mode)",
        sender: 'bot',
        timestamp: new Date(Date.now() + 1000)
      };

      const storedMessages = localStorage.getItem('vyanman-messages');
      const messages = storedMessages ? JSON.parse(storedMessages) : [];
      messages.push(userMessage, botMessage);
      localStorage.setItem('vyanman-messages', JSON.stringify(messages));

      throw error;
    }
  }
};
