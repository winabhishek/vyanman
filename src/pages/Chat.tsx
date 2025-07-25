
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
import { enhancedChatAPI } from '@/services/enhancedChatAPI';
import { Message } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const getPersonalizedGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Good morning! I'm Vyanman, your AI wellness companion with enhanced emotional intelligence. How are you feeling today?";
  if (hour < 18) return "Good afternoon! I'm Vyanman, your intelligent mental wellness partner. How are you doing today?";
  return "Good evening! I'm Vyanman, here to support your wellbeing with personalized care. How are you feeling tonight?";
};

const getHindiGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return "सुप्रभात! मैं व्यानमन हूँ, आपका बुद्धिमान AI कल्याण साथी। आज आप कैसा महसूस कर रहे हैं?";
  if (hour < 18) return "नमस्कार! मैं व्यानमन हूँ, आपका व्यक्तिगत मानसिक कल्याण साथी। आज आप कैसा महसूस कर रहे हैं?";
  return "शुभ संध्या! मैं व्यानमन हूँ, व्यक्तिगत देखभाल के साथ आपका कल्याण साथी। आज आप कैसा महसूस कर रहे हैं?";
};

const initialMessages: Message[] = [
  {
    id: '1',
    content: getPersonalizedGreeting(),
    sender: 'bot',
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  }
];

const initialMessagesHindi: Message[] = [
  {
    id: '1',
    content: getHindiGreeting(),
    sender: 'bot',
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  }
];

const feelingOptions = [
  { label: 'Happy', icon: <Smile className="h-4 w-4" />, message: "I'm feeling happy and positive today", messageHi: "मैं आज खुश और सकारात्मक महसूस कर रहा हूँ" },
  { label: 'Okay', icon: <Meh className="h-4 w-4" />, message: "I'm feeling okay, but could use some support", messageHi: "मैं ठीक महसूस कर रहा हूँ, लेकिन कुछ सहारा चाहिए" },
  { label: 'Stressed', icon: <Frown className="h-4 w-4" />, message: "I'm feeling stressed and overwhelmed", messageHi: "मैं तनावग्रस्त और अभिभूत महसूस कर रहा हूँ" }
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
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await enhancedChatAPI.getMessages();
        if (fetchedMessages && fetchedMessages.length > 0) {
          setMessages(fetchedMessages);
          setShowFeelings(false);
        } else {
          setMessages(language === 'en' ? initialMessages : initialMessagesHindi);
          setShowFeelings(true);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: language === 'en' ? "Using Enhanced Mode" : "उन्नत मोड का उपयोग",
          description: language === 'en' 
            ? "AI is ready with enhanced emotional intelligence." 
            : "AI बेहतर भावनात्मक बुद्धि के साथ तैयार है।",
          variant: "default",
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
        title: language === 'en' ? "Enhanced Demo Mode" : "उन्नत डेमो मोड",
        description: language === 'en' 
          ? "Experience AI-powered conversations. Log in to save your chats." 
          : "AI-संचालित बातचीत का अनुभव करें। चैट सहेजने के लिए लॉग इन करें।",
        variant: "default",
      });
    }
  }, [user, toast, language]);
  
  const handleSendMessage = async (input: string) => {
    if (input.trim() === '' || isLoading) return;
    
    setShowFeelings(false);
    
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
      console.log(`Enhanced AI processing: ${detected}`);
      
      const botMessage = await enhancedChatAPI.sendMessage(input, detected);
      console.log('Enhanced bot response:', botMessage);
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: language === 'en' 
          ? "I'm experiencing some connectivity issues, but I'm still here to help you. Please try again." 
          : "मुझे कुछ कनेक्टिविटी समस्याएं हो रही हैं, लेकिन मैं अभी भी आपकी मदद के लिए यहां हूं। कृपया पुनः प्रयास करें।",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: language === 'en' ? "Connection issue" : "कनेक्शन समस्या",
        description: language === 'en' 
          ? "AI is running in enhanced offline mode." 
          : "AI उन्नत ऑफलाइन मोड में चल रहा है।",
        variant: "default",
      });
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(language === 'en' ? initialMessages : initialMessagesHindi);
    setShowFeelings(true);
    localStorage.removeItem('vyanman-messages');
    toast({
      title: language === 'en' ? "Chat reset" : "चैट रीसेट",
      description: language === 'en' 
        ? "Fresh start with enhanced AI capabilities." 
        : "उन्नत AI क्षमताओं के साथ नई शुरुआत।",
      variant: "default",
    });
  };

  const handleFeelingClick = (message: string) => {
    handleSendMessage(message);
  };
  
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
              <AvatarImage src="/lovable-uploads/1bc785b7-5504-4cf1-a065-d957430f5da4.png" alt="Vyanman" />
              <AvatarFallback>
                <Bot className="text-amber-500" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <h2 className="font-semibold text-amber-800 dark:text-amber-300">Vyanman AI</h2>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {language === 'en' ? 'Enhanced emotional intelligence companion' : 'उन्नत भावनात्मक बुद्धि साथी'}
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
                <p>{language === 'en' ? 'AI-powered mental health support' : 'AI-संचालित मानसिक स्वास्थ्य सहायता'}</p>
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
