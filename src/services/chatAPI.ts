
import { Message } from '../types';

// Mock delay function to simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to detect language (basic)
const detectLanguage = (text: string): 'en' | 'hi' => {
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text) ? 'hi' : 'en';
};

// Together API configuration
const TOGETHER_API_KEY = "89af2b854ed98788335333ce318bfb11f66c7d6d64ec53c3bd7a74e7e5c264a5";
const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";

export const chatAPI = {
  // Get all messages for the current user
  getMessages: async (): Promise<Message[]> => {
    await delay(500);
    const storedMessages = localStorage.getItem('vyanamana-messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  },

  // Send a message and get a response
  sendMessage: async (content: string, language: string = 'en'): Promise<Message> => {
    try {
      const response = await fetch(TOGETHER_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.1",
          messages: [
            {
              role: "system",
              content: `You are Vyānamana, an empathetic mental health companion. Respond in ${language}. Offer emotional support and avoid repeating the same lines.`
            },
            {
              role: "user",
              content: content
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response from Together API');
      }

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content?.trim() || "I'm here for you.";

      const userMessage: Message = {
        id: `user-msg-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
        sentiment: { score: 3, label: 'neutral' }
      };

      const botMessage: Message = {
        id: `bot-msg-${Date.now() + 1}`,
        content: botReply,
        sender: 'bot',
        timestamp: new Date(Date.now() + 1000)
      };

      const storedMessages = localStorage.getItem('vyanamana-messages');
      const messages = storedMessages ? JSON.parse(storedMessages) : [];
      messages.push(userMessage, botMessage);
      localStorage.setItem('vyanamana-messages', JSON.stringify(messages));

      return botMessage;
    } catch (error) {
      console.error('Error in Together API call:', error);
      throw error;
    }
  }
};
