
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, RefreshCcw, Bot, HelpCircle, Smile, Frown, Meh } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const getPersonalizedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Good morning! I'm Vyanman, your wellness companion. How are you feeling today?";
  if (hour < 18) return "Good afternoon! I'm Vyanman, your mental wellness partner. How are you doing today?";
  return "Good evening! I'm Vyanman, here to support your wellbeing. How are you feeling tonight?";
};

const getHindiGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return "सुप्रभात! मैं व्यानमन हूँ, आपका मानसिक कल्याण साथी। आज आप कैसा महसूस कर रहे हैं?";
  if (hour < 18) return "नमस्कार! मैं व्यानमन हूँ, आपका मानसिक कल्याण साथी। आज आप कैसा महसूस कर रहे हैं?";
  return "शुभ संध्या! मैं व्यानमन हूँ, आपका मानसिक कल्याण साथी। आज आप कैसा महसूस कर रहे हैं?";
};

const initialMessages: Message[] = [
  {
    id: '1',
    content: getPersonalizedGreeting(),
    sender: 'bot',
    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  }
];

const initialMessagesHindi: Message[] = [
  {
    id: '1',
    content: getHindiGreeting(),
    sender: 'bot',
    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  }
];

// Quick feeling buttons for better engagement
const feelingOptions = [
  { label: 'Happy', icon: <Smile className="h-4 w-4" />, message: "I'm feeling happy today", messageHi: "मैं आज खुश महसूस कर रहा हूँ" },
  { label: 'Okay', icon: <Meh className="h-4 w-4" />, message: "I'm feeling okay, but could be better", messageHi: "मैं ठीक महसूस कर रहा हूँ, लेकिन बेहतर हो सकता है" },
  { label: 'Stressed', icon: <Frown className="h-4 w-4" />, message: "I'm feeling stressed and anxious", messageHi: "मैं तनावग्रस्त और चिंतित महसूस कर रहा हूँ" }
];

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(language === 'en' ? initialMessages : initialMessagesHindi);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeelings, setShowFeelings] = useState(true);
  
  // Fetch messages on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await chatAPI.getMessages();
        if (fetchedMessages && fetchedMessages.length > 0) {
          setMessages(fetchedMessages);
          setShowFeelings(false); // Hide feelings buttons if we have conversation history
        } else {
          // Set appropriate initial messages based on language
          setMessages(language === 'en' ? initialMessages : initialMessagesHindi);
          setShowFeelings(true);
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
    
    setShowFeelings(false); // Hide feeling buttons once user starts typing
    
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
    setMessages(language === 'en' ? initialMessages : initialMessagesHindi);
    setShowFeelings(true);
    toast({
      title: language === 'en' ? "Chat reset" : "चैट रीसेट",
      description: language === 'en' 
        ? "Your conversation has been reset." 
        : "आपकी बातचीत रीसेट कर दी गई है।",
      variant: "default",
    });
  };

  const handleFeelingClick = (message: string) => {
    handleSendMessage(message);
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
      <div className="py-4 px-4 flex justify-between items-center border-b mb-4 glass-card bg-card rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }} 
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Avatar className="border-2 border-amber-300 dark:border-amber-500">
              <AvatarImage src="/favicon.ico" alt="Vyanman" />
              <AvatarFallback>
                <Bot className="text-amber-500" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <h2 className="font-semibold text-amber-800 dark:text-amber-300">Vyanman</h2>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {language === 'en' ? 'Your mental wellness companion' : 'आपका मानसिक कल्याण साथी'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleResetChat}
                  className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:hover:text-amber-200 dark:hover:bg-amber-900/30"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === 'en' ? 'Reset conversation' : 'बातचीत रीसेट करें'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:hover:text-amber-200 dark:hover:bg-amber-900/30"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{language === 'en' ? 'Ask me anything about mental health' : 'मानसिक स्वास्थ्य के बारे में कुछ भी पूछें'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <ChatContainer 
        messages={messages} 
        isLoading={isTyping} 
        messagesEndRef={messagesEndRef} 
      />
      
      {/* Quick feeling selector */}
      <AnimatePresence>
        {showFeelings && (
          <motion.div 
            className="flex flex-wrap gap-2 justify-center my-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="w-full text-center text-sm text-muted-foreground mb-1">
              {language === 'en' ? 'How are you feeling right now?' : 'आप अभी कैसा महसूस कर रहे हैं?'}
            </p>
            {feelingOptions.map(option => (
              <Button 
                key={option.label}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                onClick={() => handleFeelingClick(language === 'en' ? option.message : option.messageHi)}
              >
                {option.icon}
                <span>{language === 'en' ? option.label : (
                  option.label === 'Happy' ? 'खुश' :
                  option.label === 'Okay' ? 'ठीक' :
                  'तनावग्रस्त'
                )}</span>
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="p-4 border-t glass-card bg-card rounded-lg shadow-md mt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </motion.div>
    </motion.div>
  );
};

export default Chat;
