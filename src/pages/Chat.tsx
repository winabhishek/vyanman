
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import MoodTracker from '@/components/MoodTracker';
import { Message } from '@/types';
import { chatAPI } from '@/services'; 
import { Button } from '@/components/ui/button';
import { ArrowUp, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

const Chat: React.FC = () => {
  const { isAuthenticated, continueAsGuest } = useAuth();
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  
  // Fetch existing messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await chatAPI.getMessages();
        if (fetchedMessages.length === 0) {
          // Add a welcome message if there are no messages
          const welcomeMessage: Message = {
            id: 'welcome',
            content: language === 'en' 
              ? "Hello! I'm Vyānamana, your mental wellbeing companion. How are you feeling today?"
              : "नमस्ते! मैं व्यानमन हूँ, आपका मानसिक स्वास्थ्य साथी। आज आप कैसा महसूस कर रहे हैं?",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        } else {
          setMessages(fetchedMessages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    
    if (isAuthenticated) {
      loadMessages();
    }
  }, [isAuthenticated, language]);
  
  // Auto-scroll to bottom of messages - improved scroll implementation
  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Small delay to ensure content is rendered
    }
  }, [messages, isLoading]);
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    if (!isAuthenticated) {
      // If not authenticated, continue as guest and then send message
      try {
        await continueAsGuest();
      } catch (error) {
        console.error('Error continuing as guest:', error);
        return;
      }
    }
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Add language to the message context
      const botResponse = await chatAPI.sendMessage(content, language);
      setMessages(prev => [...prev, botResponse]);
      
      // Suggest mood tracking if appropriate
      const moodKeywords = {
        en: ['feeling', 'mood', 'emotions', 'stress', 'anxious', 'happy', 'sad'],
        hi: ['महसूस', 'मूड', 'भावनाएं', 'तनाव', 'चिंतित', 'खुश', 'दुखी']
      };
      
      const currentLanguageKeywords = moodKeywords[language as keyof typeof moodKeywords];
      const shouldSuggestMoodTracking = currentLanguageKeywords.some(keyword => 
        content.toLowerCase().includes(keyword)
      );
      
      if (shouldSuggestMoodTracking && !showMoodTracker) {
        // Show mood tracker after a delay
        setTimeout(() => {
          setShowMoodTracker(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: language === 'en'
          ? "I'm sorry, I'm having trouble responding right now. Please try again in a moment."
          : "क्षमा करें, मुझे अभी जवाब देने में परेशानी हो रही है। कृपया कुछ क्षण बाद पुनः प्रयास करें।",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMoodLogged = () => {
    // Hide mood tracker after logging
    setShowMoodTracker(false);
    
    // Add a follow-up message
    const followUpMessage: Message = {
      id: `bot-${Date.now()}`,
      content: language === 'en'
        ? "Thanks for logging your mood! Tracking regularly can help you notice patterns in how you feel. Is there anything specific about your mood you'd like to discuss?"
        : "अपना मूड लॉग करने के लिए धन्यवाद! नियमित रूप से ट्रैक करने से आपको यह पता चल सकता है कि आप कैसा महसूस करते हैं। क्या आपके मूड के बारे में कोई विशेष बात है जिसके बारे में आप चर्चा करना चाहेंगे?",
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, followUpMessage]);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div 
      className="container mx-auto max-w-4xl px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col h-[calc(100vh-16rem)]">
        <motion.div 
          className="flex justify-between items-center mb-6"
          variants={itemVariants}
        >
          <h1 className="text-2xl font-bold font-heading gradient-heading">
            {language === 'en' ? 'Chat with Vyānamana' : 'व्यानमन से चैट करें'}
          </h1>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/mood-tracker')}
            className="flex items-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            {language === 'en' ? 'View Mood History' : 'मूड इतिहास देखें'}
          </Button>
        </motion.div>
        
        <motion.div 
          className="flex-1 overflow-hidden p-4 border rounded-lg mb-4 glass-card bg-card/30 backdrop-blur-sm"
          variants={itemVariants}
        >
          <ScrollArea className="h-full pr-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground mb-4">
                  {language === 'en' 
                    ? 'Start chatting with Vyānamana, your mental wellbeing companion.'
                    : 'व्यानमन के साथ चैट शुरू करें, आपका मानसिक स्वास्थ्य साथी।'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'en'
                    ? 'Your conversations are private and secure.'
                    : 'आपकी बातचीत निजी और सुरक्षित है।'}
                </p>
              </div>
            ) : (
              <>
                {messages.map(message => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="chat-bubble-bot">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </ScrollArea>
        </motion.div>
        
        <motion.div 
          className="sticky bottom-0 bg-background pt-2"
          variants={itemVariants}
        >
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          
          {messages.length > 10 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2"
              >
                <ArrowUp className="h-4 w-4" />
                {language === 'en' ? 'Scroll to bottom' : 'नीचे स्क्रॉल करें'}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      
      {showMoodTracker && (
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MoodTracker onMoodLogged={handleMoodLogged} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Chat;
