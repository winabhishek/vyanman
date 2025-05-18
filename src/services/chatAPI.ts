
import { supabase } from '../supabaseClient';
import { Message } from '../types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Helper to detect language (improved)
const detectLanguage = (text: string): 'en' | 'hi' => {
  // Check for Hindi Unicode character ranges
  const hindiPattern = /[\u0900-\u097F\u0980-\u09FF]/;
  return hindiPattern.test(text) ? 'hi' : 'en';
};

// Helper to analyze input content for better fallback responses
const analyzeContent = (content: string): string => {
  content = content.toLowerCase();
  
  if (content.includes('help') || content.includes('मदद')) {
    return 'help';
  } else if (content.includes('sad') || content.includes('unhappy') || content.includes('उदास') || content.includes('दुखी')) {
    return 'sad';
  } else if (content.includes('anxious') || content.includes('worry') || content.includes('चिंता') || content.includes('घबराहट')) {
    return 'anxious';
  } else if (content.includes('happy') || content.includes('good') || content.includes('खुश') || content.includes('अच्छा')) {
    return 'happy';
  } else if (content.includes('sleep') || content.includes('tired') || content.includes('नींद') || content.includes('थका')) {
    return 'sleep';
  } else {
    return 'general';
  }
};

// Enhanced offline responses for more natural conversation
const generateOfflineResponse = (content: string, language: string = 'en'): string => {
  const contentType = analyzeContent(content);
  
  if (language === 'en') {
    switch (contentType) {
      case 'help':
        return "I'm here to support you. Would you like to talk about something specific, try a breathing exercise, or explore mindfulness techniques? I'm happy to guide you through whatever might help you feel better.";
      case 'sad':
        return "I understand feeling down can be really difficult. Would you like to share more about what's happening? Sometimes putting feelings into words can help us process them. I'm here to listen without judgment.";
      case 'anxious':
        return "Anxiety can feel overwhelming. Let's take a moment together - try taking a slow deep breath in through your nose for 4 counts, hold for 2, and exhale through your mouth for 6. Would you like to try some other calming techniques?";
      case 'happy':
        return "It's wonderful to hear you're feeling good! Celebrating positive moments is important for our wellbeing. What's contributed to your good mood today? Recognizing these factors can help build more positive experiences.";
      case 'sleep':
        return "Sleep is so important for mental health. Are you having trouble falling asleep or staying asleep? I can suggest some relaxation techniques that might help you unwind before bedtime.";
      case 'general':
      default:
        return "I'm here to support your mental wellbeing journey. How are you truly feeling today? Sometimes simply acknowledging our emotions can be a helpful first step.";
    }
  } else {
    switch (contentType) {
      case 'help':
        return "मैं आपका साथ देने के लिए यहां हूँ। क्या आप किसी विशेष विषय पर बात करना चाहेंगे, श्वास व्यायाम का प्रयास करना चाहेंगे, या माइंडफुलनेस तकनीकों का अन्वेषण करना चाहेंगे? मैं आपको हर उस चीज़ के माध्यम से मार्गदर्शन करने के लिए खुश हूं जिससे आपको बेहतर महसूस हो सकता है।";
      case 'sad':
        return "मैं समझता हूं कि उदास महसूस करना वास्तव में कठिन हो सकता है। क्या आप जो हो रहा है उसके बारे में अधिक साझा करना चाहेंगे? कभी-कभी भावनाओं को शब्दों में रखने से उन्हें संसाधित करने में मदद मिल सकती है। मैं बिना किसी निर्णय के सुनने के लिए यहां हूं।";
      case 'anxious':
        return "चिंता अभिभूत महसूस हो सकती है। आइए साथ में एक पल लें - अपनी नाक से 4 गिनती के लिए धीरे-धीरे गहरी सांस लेने का प्रयास करें, 2 के लिए रोकें, और अपने मुंह से 6 के लिए सांस छोड़ें। क्या आप कुछ अन्य शांत तकनीकों का प्रयास करना चाहेंगे?";
      case 'happy':
        return "यह सुनकर अच्छा लगा कि आप अच्छा महसूस कर रहे हैं! सकारात्मक क्षणों का जश्न मनाना हमारी भलाई के लिए महत्वपूर्ण है। आज आपके अच्छे मूड में क्या योगदान दिया है? इन कारकों को पहचानने से अधिक सकारात्मक अनुभव बनाने में मदद मिल सकती है।";
      case 'sleep':
        return "नींद मानसिक स्वास्थ्य के लिए बहुत महत्वपूर्ण है। क्या आपको सोने में या सोए रहने में परेशानी हो रही है? मैं कुछ आराम तकनीकों का सुझाव दे सकता हूं जो आपको सोने से पहले तनाव कम करने में मदद कर सकती हैं।";
      case 'general':
      default:
        return "मैं आपकी मानसिक कल्याण यात्रा का समर्थन करने के लिए यहां हूं। आज आप वास्तव में कैसा महसूस कर रहे हैं? कभी-कभी अपनी भावनाओं को स्वीकार करना एक उपयोगी पहला कदम हो सकता है।";
    }
  }
};

// Multiple fallback responses for variation
const getFallbackResponse = (language: string, type: string = 'error'): string => {
  const errorResponses = {
    en: [
      "I'm having trouble connecting to my knowledge base right now. Can we try again in a moment?",
      "It seems my connection is a bit unstable. Let's give it another try shortly.",
      "I apologize for the interruption. I'm experiencing some technical difficulties. How else can I support you?",
      "My systems need a moment to reconnect. While we wait, how are you feeling today?",
      "I seem to be having connection issues. Let's try again - I'm here to help you."
    ],
    hi: [
      "मुझे अभी अपने ज्ञान आधार से जुड़ने में परेशानी हो रही है। क्या हम एक पल में फिर से प्रयास कर सकते हैं?",
      "ऐसा लगता है कि मेरा कनेक्शन थोड़ा अस्थिर है। जल्द ही फिर से प्रयास करें।",
      "रुकावट के लिए मैं क्षमा चाहता हूँ। मुझे कुछ तकनीकी कठिनाइयों का अनुभव हो रहा है। मैं आपका समर्थन कैसे कर सकता हूँ?",
      "मेरी प्रणालियों को फिर से जुड़ने के लिए एक क्षण की आवश्यकता है। जब तक हम इंतजार करते हैं, आज आप कैसा महसूस कर रहे हैं?",
      "लगता है मुझे कनेक्शन समस्याएँ आ रही हैं। फिर से प्रयास करें - मैं आपकी मदद के लिए यहां हूँ।"
    ]
  };

  const index = Math.floor(Math.random() * 5);
  return language === 'en' ? errorResponses.en[index] : errorResponses.hi[index];
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

  // Send a message and get a response with improved error handling and retries
  sendMessage: async (content: string, language: string = 'en'): Promise<Message> => {
    let retryCount = 0;
    const maxRetries = 2;
    
    const attemptSend = async (): Promise<Message> => {
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
        console.error(`Error attempt ${retryCount + 1}/${maxRetries}:`, error);
        
        if (retryCount < maxRetries) {
          // Exponential backoff for retries
          retryCount++;
          const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s
          console.log(`Retrying in ${delay}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptSend();
        }
        
        // All retries failed, use offline fallback
        console.error('All retries failed, using fallback response');
        
        // Show error toast (only after all retries failed)
        toast({
          title: language === 'en' ? "Connection Issue" : "कनेक्शन समस्या",
          description: language === 'en' 
            ? "Using offline mode. Your messages will sync when connection is restored."
            : "ऑफ़लाइन मोड का उपयोग कर रहा है। कनेक्शन बहाल होने पर आपके संदेश सिंक हो जाएंगे।",
          variant: "default",
        });
        
        // Generate personalized offline response
        const botResponse = generateOfflineResponse(content, language);
        
        // Create bot message
        const botMessage: Message = {
          id: `bot-msg-${Date.now() + 1}`,
          content: botResponse,
          sender: 'bot',
          timestamp: new Date(Date.now() + 1000)
        };
        
        // Store in localStorage
        const storedMessages = localStorage.getItem('vyanman-messages') || '[]';
        const messages = JSON.parse(storedMessages);
        messages.push(botMessage);
        localStorage.setItem('vyanman-messages', JSON.stringify(messages));

        return botMessage;
      }
    };
    
    return attemptSend();
  }
};
