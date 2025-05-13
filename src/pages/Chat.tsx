
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, RefreshCcw, Bot, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatTime } from '@/lib/utils';
import ChatTypingIndicator from '@/components/ChatTypingIndicator';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatInput from '@/components/ChatInput';
import ChatContainer from '@/components/chat/ChatContainer';
import ChatHeader from '@/components/chat/ChatHeader';
import { chatAPI } from '@/services/chatAPI';
import { Message } from '@/types';

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hello! I'm Vyanman, your mental wellness companion. How are you feeling today?",
    sender: 'bot',
    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  }
];

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await chatAPI.getMessages();
        if (fetchedMessages && fetchedMessages.length > 0) {
          setMessages(fetchedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: language === 'en' ? "Error Loading Messages" : "संदेश लोड करने में त्रुटि",
          description: language === 'en' 
            ? "Could not load your previous conversations." 
            : "आपकी पिछली बातचीत लोड नहीं हो सकी।",
          variant: "destructive",
        });
      }
    };
    
    fetchMessages();
  }, [user, toast, language]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!user) {
      toast({
        title: language === 'en' ? "You're in demo mode" : "आप डेमो मोड में हैं",
        description: language === 'en' 
          ? "Log in to save your conversations and get personalized responses." 
          : "अपनी बातचीत को सहेजने और व्यक्तिगत प्रतिक्रियाएँ प्राप्त करने के लिए लॉग इन करें।",
        variant: "default",
      });
    }
  }, [user, toast, language]);
  
  const handleSendMessage = async (input: string) => {
    if (input.trim() === '' || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setIsLoading(true);
    
    try {
      const detected = detectLanguage(input);
      console.log(`Detected language: ${detected}`);
      
      const botMessage = await chatAPI.sendMessage(input, detected);
      console.log('Bot response:', botMessage);
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback message in case of error
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: language === 'en' 
          ? "Sorry, I'm having trouble connecting. Please try again later." 
          : "क्षमा करें, मुझे कनेक्ट करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: language === 'en' ? "Connection error" : "कनेक्शन त्रुटि",
        description: language === 'en' 
          ? "Could not connect to the chat service." 
          : "चैट सेवा से कनेक्ट नहीं हो सका।",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
    toast({
      title: language === 'en' ? "Chat reset" : "चैट रीसेट",
      description: language === 'en' 
        ? "Your conversation has been reset." 
        : "आपकी बातचीत रीसेट कर दी गई है।",
      variant: "default",
    });
  };
  
  // Helper to detect language (basic)
  const detectLanguage = (text: string): 'en' | 'hi' => {
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(text) ? 'hi' : 'en';
  };

  return (
    <motion.div 
      className="container mx-auto max-w-4xl h-[calc(100vh-13rem)] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-4 px-4 flex justify-between items-center border-b mb-4 glass-card bg-amber-900/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Avatar>
              <AvatarImage src="/favicon.ico" alt="Vyanman" />
              <AvatarFallback>
                <Bot className="text-amber-500" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <h2 className="font-semibold text-amber-50">Vyanman</h2>
            <p className="text-xs text-amber-200/80">
              {language === 'en' ? 'Your mental wellness companion' : 'आपका मानसिक कल्याण साथी'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleResetChat} title="Reset conversation" className="text-amber-200 hover:text-amber-100 hover:bg-amber-900/30">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Help" className="text-amber-200 hover:text-amber-100 hover:bg-amber-900/30">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <ChatContainer 
        messages={messages} 
        isLoading={isTyping} 
        messagesEndRef={messagesEndRef} 
      />
      
      <div className="p-4 border-t glass-card bg-amber-900/20 backdrop-blur-md">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </motion.div>
  );
};

export default Chat;
