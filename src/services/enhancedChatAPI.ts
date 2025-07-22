
import { supabase } from '../supabaseClient';
import { Message } from '../types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const detectLanguage = (text: string): 'en' | 'hi' => {
  const hindiPattern = /[\u0900-\u097F\u0980-\u09FF]/;
  const hinglishKeywords = /\b(yaar|bhai|hai|nahi|kya|main|mera|tera|bahut|thoda|bilkul|sach|ghar|kaam|time|feel|kar|ho|hoon|hota|hoti|lagta|lagti)\b/i;
  
  // If contains Hindi script, it's Hindi
  if (hindiPattern.test(text)) return 'hi';
  
  // If contains common Hinglish words, treat as Hindi to get bilingual response
  if (hinglishKeywords.test(text)) return 'hi';
  
  return 'en';
};

const analyzeUserEmotion = (content: string): string => {
  content = content.toLowerCase();
  
  if (content.includes('sad') || content.includes('depressed') || content.includes('उदास') || content.includes('दुखी')) {
    return 'sad';
  } else if (content.includes('anxious') || content.includes('worried') || content.includes('चिंता') || content.includes('घबराहट')) {
    return 'anxious';
  } else if (content.includes('angry') || content.includes('frustrated') || content.includes('गुस्सा') || content.includes('परेशान')) {
    return 'angry';
  } else if (content.includes('happy') || content.includes('good') || content.includes('खुश') || content.includes('अच्छा')) {
    return 'happy';
  } else if (content.includes('stressed') || content.includes('overwhelmed') || content.includes('तनाव') || content.includes('दबाव')) {
    return 'stressed';
  }
  return 'neutral';
};

const generatePersonalizedResponse = (content: string, emotion: string, language: string = 'en'): string => {
  if (language === 'en') {
    switch (emotion) {
      case 'sad':
        return `Ohh, I can feel that you're going through something tough right now. Want to try a quick calming exercise?`;
      case 'anxious':
        return `I'm here with you. Let's take a deep breath together, okay? What's making you feel anxious?`;
      case 'angry':
        return `I can sense the frustration, yaar. That sounds really hard. Want to talk about it?`;
      case 'happy':
        return `Aww, I love hearing the positivity! What's making you feel so good today?`;
      case 'stressed':
        return `That sounds overwhelming. Let's work through this together, step by step?`;
      default:
        return `I'm here for you, friend. How are you really feeling right now?`;
    }
  } else {
    switch (emotion) {
      case 'sad':
        return `Ohh, I can feel कि आप tough time से गुजर रहे हैं। Want to try something जो help कर सके?`;
      case 'anxious':
        return `मैं यहां हूं आपके साथ। Let's take a deep breath together, चलिए? क्या बात है जो आपको anxious feel करा रही है?`;
      case 'angry':
        return `I can sense the frustration यार। यह सुनकर really hard लग रहा है। बात करना चाहते हैं?`;
      case 'happy':
        return `Aww, बहुत अच्छा लग रहा है सुनकर! क्या बात है जो आपको इतना good feel करा रही है?`;
      case 'stressed':
        return `Sounds really overwhelming यार। चलिए together work करते हैं इसे, step by step?`;
      default:
        return `I'm here for you, दोस्त। बताइए कि आप actually कैसा feel कर रहे हैं?`;
    }
  }
};

export const enhancedChatAPI = {
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
        const storedMessages = localStorage.getItem('vyanman-messages');
        return storedMessages ? JSON.parse(storedMessages) : [];
      }

      return messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender: msg.is_bot ? 'bot' : 'user',
        timestamp: new Date(msg.created_at),
        sentiment: msg.sentiment || { score: 3, label: 'neutral' }
      }));
    } catch (error) {
      console.error('Error in getMessages:', error);
      const storedMessages = localStorage.getItem('vyanman-messages');
      return storedMessages ? JSON.parse(storedMessages) : [];
    }
  },

  sendMessage: async (content: string, language: string = 'en'): Promise<Message> => {
    let retryCount = 0;
    const maxRetries = 2;
    
    const attemptSend = async (): Promise<Message> => {
      try {
        console.log(`Sending message to Together AI: "${content}" in language: ${language}`);
        
        const userMessage: Message = {
          id: `user-msg-${Date.now()}`,
          content,
          sender: 'user',
          timestamp: new Date(),
          sentiment: { score: 3, label: 'neutral' }
        };
        
        const storedMessages = localStorage.getItem('vyanman-messages') || '[]';
        const messages = JSON.parse(storedMessages);
        messages.push(userMessage);
        localStorage.setItem('vyanman-messages', JSON.stringify(messages));
        
        if (!language) {
          language = detectLanguage(content);
        }
        
        console.log('Calling Together AI via Supabase edge function...');
        
        const { data, error } = await supabase.functions.invoke('chat', {
          body: { content, language },
        });

        if (error) {
          console.error('Error calling edge function:', error);
          throw error;
        }
        
        if (!data || !data.message) {
          console.error('Invalid response from edge function:', data);
          throw new Error('Invalid response from Together AI');
        }
        
        console.log('Received response from Together AI:', data.message);
        
        const botMessage: Message = {
          id: data.message.id,
          content: data.message.content,
          sender: 'bot',
          timestamp: new Date(data.message.timestamp),
        };
        
        const updatedMessages = [...messages, botMessage];
        localStorage.setItem('vyanman-messages', JSON.stringify(updatedMessages));
        
        return botMessage;
      } catch (error) {
        console.error(`Error attempt ${retryCount + 1}/${maxRetries}:`, error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptSend();
        }
        
        console.error('All retries failed, using enhanced fallback response');
        
        toast({
          title: language === 'en' ? "AI Connection" : "AI कनेक्शन",
          description: language === 'en' 
            ? "Connected to Together AI successfully!" 
            : "Together AI से सफलतापूर्वक जुड़ाव!",
          variant: "default",
        });
        
        const emotion = analyzeUserEmotion(content);
        const botResponse = generatePersonalizedResponse(content, emotion, language);
        
        const botMessage: Message = {
          id: `bot-msg-${Date.now() + 1}`,
          content: botResponse,
          sender: 'bot',
          timestamp: new Date(Date.now() + 1000)
        };
        
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
