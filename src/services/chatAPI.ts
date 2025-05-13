
import { supabase } from '../supabaseClient';
import { Message } from '../types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

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
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.log('User not authenticated, fetching from localStorage');
        const storedMessages = localStorage.getItem('vyanman-messages');
        return storedMessages ? JSON.parse(storedMessages) : [];
      }
      
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
      // Log user's message for debugging
      console.log(`Sending message: "${content}" in language: ${language}`);
      
      // User message to be saved
      const userMessage: Message = {
        id: `user-msg-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
        sentiment: { score: 3, label: 'neutral' }
      };
      
      // Store the user message in localStorage as a backup
      const storedMessages = localStorage.getItem('vyanman-messages') || '[]';
      const messages = JSON.parse(storedMessages);
      messages.push(userMessage);
      localStorage.setItem('vyanman-messages', JSON.stringify(messages));
      
      // Detect language if not provided
      if (!language) {
        language = detectLanguage(content);
      }
      
      // Call our edge function
      console.log('Calling Supabase edge function...');
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { content, language },
      });

      if (error) {
        console.error('Error calling edge function:', error);
        throw error;
      }
      
      if (!data || !data.message) {
        console.error('Invalid response from edge function:', data);
        throw new Error('Invalid response from server');
      }
      
      console.log('Received response:', data.message);
      
      // Update message history in localStorage
      const updatedMessages = [
        ...messages,
        {
          id: data.message.id,
          content: data.message.content,
          sender: 'bot',
          timestamp: new Date(data.message.timestamp),
        }
      ];
      localStorage.setItem('vyanman-messages', JSON.stringify(updatedMessages));
      
      return data.message;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Show error toast
      toast({
        title: language === 'en' ? "Connection Error" : "कनेक्शन त्रुटि",
        description: language === 'en' 
          ? "Couldn't connect to the AI service. Using offline mode."
          : "AI सेवा से कनेक्ट नहीं कर सका। ऑफलाइन मोड का उपयोग कर रहा है।",
        variant: "destructive",
      });
      
      // Fallback to offline mode with predefined responses
      const userMessage: Message = {
        id: `user-msg-${Date.now()}`,
        content,
        sender: 'user',
        timestamp: new Date(),
        sentiment: { score: 3, label: 'neutral' }
      };

      // Store the user message in localStorage
      const storedMessages = localStorage.getItem('vyanman-messages');
      const messages = storedMessages ? JSON.parse(storedMessages) : [];
      messages.push(userMessage);
      
      // Generate AI response based on user input
      let botResponse = "मैं आपकी मदद के लिए यहां हूँ। (ऑफलाइन मोड)";
      
      if (language === 'en') {
        botResponse = "I'm here for you. (Offline mode)";
        
        // Simple pattern matching for common inputs in English
        if (content.toLowerCase().includes('hello') || content.toLowerCase().includes('hi')) {
          botResponse = "Hello! How are you feeling today?";
        } else if (content.toLowerCase().includes('sad') || content.toLowerCase().includes('depress')) {
          botResponse = "I'm sorry to hear you're feeling down. Would you like to try a mindfulness exercise to help?";
        } else if (content.toLowerCase().includes('anxious') || content.toLowerCase().includes('stress')) {
          botResponse = "Anxiety can be challenging. Let's take a deep breath together. Inhale slowly for 4 counts, hold for 4, and exhale for 6.";
        } else if (content.toLowerCase().includes('happy') || content.toLowerCase().includes('good')) {
          botResponse = "I'm glad to hear you're feeling well! What positive things happened today?";
        } else if (content.toLowerCase().includes('cbt') || content.toLowerCase().includes('therapy')) {
          botResponse = "Cognitive Behavioral Therapy (CBT) can help identify negative thought patterns. Try our CBT section for structured exercises.";
        }
      } else {
        // Simple pattern matching for common inputs in Hindi
        if (content.includes('नमस्ते') || content.includes('हैलो')) {
          botResponse = "नमस्ते! आप आज कैसा महसूस कर रहे हैं?";
        } else if (content.includes('दुखी') || content.includes('उदास')) {
          botResponse = "मुझे सुनकर दुख हुआ कि आप उदास महसूस कर रहे हैं। क्या आप मदद के लिए एक माइंडफुलनेस अभ्यास करना चाहेंगे?";
        } else if (content.includes('चिंता') || content.includes('तनाव')) {
          botResponse = "चिंता चुनौतीपूर्ण हो सकती है। आइए साथ में गहरी सांस लेते हैं। 4 गिनती के लिए धीरे से सांस लें, 4 के लिए रोकें, और 6 के लिए सांस छोड़ें।";
        } else if (content.includes('खुश') || content.includes('अच्छा')) {
          botResponse = "मुझे खुशी है कि आप अच्छा महसूस कर रहे हैं! आज कौन सी सकारात्मक चीजें हुईं?";
        } else if (content.includes('सीबीटी') || content.includes('थेरेपी')) {
          botResponse = "संज्ञानात्मक व्यवहार थेरेपी (CBT) नकारात्मक विचार पैटर्न की पहचान करने में मदद कर सकती है। संरचित अभ्यासों के लिए हमारे CBT अनुभाग का प्रयास करें।";
        }
      }
      
      const botMessage: Message = {
        id: `bot-msg-${Date.now() + 1}`,
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(Date.now() + 1000)
      };
      
      messages.push(botMessage);
      localStorage.setItem('vyanman-messages', JSON.stringify(messages));

      return botMessage;
    }
  }
};
