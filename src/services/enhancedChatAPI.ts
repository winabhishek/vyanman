
import { supabase } from '../supabaseClient';
import { Message } from '../types';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const detectLanguage = (text: string): 'en' | 'hi' => {
  const hindiPattern = /[\u0900-\u097F\u0980-\u09FF]/;
  return hindiPattern.test(text) ? 'hi' : 'en';
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
        return `I can sense you're going through a difficult time. It's completely natural to feel sad sometimes. Would you like to share more about what's weighing on your heart? Sometimes talking about our feelings can help us process them better. I'm here to listen without any judgment.`;
      case 'anxious':
        return `I understand that anxiety can feel overwhelming. Let's take this moment to breathe together. Try this: inhale slowly for 4 counts, hold for 4, then exhale for 6 counts. What specific thoughts or situations are making you feel anxious right now?`;
      case 'angry':
        return `I can feel the frustration in your words. Anger is a valid emotion that often signals something important to us. What's triggering these feelings? Let's explore what's underneath this anger - sometimes it can reveal what we truly need or value.`;
      case 'happy':
        return `It's wonderful to hear the positivity in your message! Celebrating these good moments is so important for our wellbeing. What's contributing to your happiness today? Recognizing these positive factors can help us cultivate more joy in our lives.`;
      case 'stressed':
        return `Stress can feel like carrying a heavy weight. I want you to know that you don't have to handle everything alone. What's the biggest source of stress in your life right now? Let's break it down together and find some practical coping strategies.`;
      default:
        return `Thank you for sharing with me. I'm here to support you on your mental wellness journey. How are you truly feeling right now? Sometimes just naming our emotions can be the first step toward understanding ourselves better.`;
    }
  } else {
    switch (emotion) {
      case 'sad':
        return `मैं समझ सकता हूं कि आप कठिन समय से गुजर रहे हैं। कभी-कभी उदास महसूस करना बिल्कुल प्राकृतिक है। क्या आप अपने दिल पर जो बोझ है उसके बारे में और बताना चाहेंगे? कभी-कभी अपनी भावनाओं के बारे में बात करने से उन्हें बेहतर तरीके से समझने में मदद मिलती है।`;
      case 'anxious':
        return `मैं समझता हूं कि चिंता अभिभूत कर सकती है। आइए इस क्षण में एक साथ सांस लें। यह करके देखें: 4 गिनती के लिए धीरे-धीरे सांस लें, 4 तक रोकें, फिर 6 गिनती के लिए सांस छोड़ें। कौन से विशिष्ट विचार या स्थितियां आपको चिंतित महसूस करा रही हैं?`;
      case 'angry':
        return `मैं आपके शब्दों में निराशा महसूस कर सकता हूं। गुस्सा एक वैध भावना है जो अक्सर हमारे लिए कुछ महत्वपूर्ण संकेत देती है। इन भावनाओं को क्या ट्रिगर कर रहा है? आइए देखें कि इस गुस्से के नीचे क्या है।`;
      case 'happy':
        return `आपके संदेश में सकारात्मकता सुनकर बहुत अच्छा लगा! इन अच्छे क्षणों का जश्न मनाना हमारी भलाई के लिए बहुत महत्वपूर्ण है। आज आपकी खुशी में क्या योगदान दे रहा है?`;
      case 'stressed':
        return `तनाव भारी बोझ की तरह महसूस हो सकता है। मैं चाहता हूं कि आप जानें कि आपको सब कुछ अकेले संभालने की जरूरत नहीं है। आपके जीवन में तनाव का सबसे बड़ा स्रोत क्या है? आइए इसे एक साथ तोड़ें और कुछ व्यावहारिक रणनीतियां खोजें।`;
      default:
        return `मेरे साथ साझा करने के लिए धन्यवाद। मैं आपकी मानसिक कल्याण यात्रा में आपका साथ देने के लिए यहां हूं। आप वास्तव में अभी कैसा महसूस कर रहे हैं? कभी-कभी अपनी भावनाओं को नाम देना खुद को बेहतर समझने की दिशा में पहला कदम हो सकता है।`;
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
        throw error;
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
        console.log(`Sending message: "${content}" in language: ${language}`);
        
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
          retryCount++;
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptSend();
        }
        
        console.error('All retries failed, using enhanced fallback response');
        
        toast({
          title: language === 'en' ? "Enhanced Offline Mode" : "उन्नत ऑफ़लाइन मोड",
          description: language === 'en' 
            ? "Using advanced AI responses while connection is restored."
            : "कनेक्शन बहाल होते समय उन्नत AI प्रतिक्रियाओं का उपयोग।",
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
