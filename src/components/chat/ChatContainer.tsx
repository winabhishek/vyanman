
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types';
import ChatMessage from '@/components/ChatMessage';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bot } from 'lucide-react';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading, messagesEndRef }) => {
  const { language } = useLanguage();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When messages change, ensure we're scrolled to the bottom
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      const scrollHeight = scrollArea.scrollHeight;
      scrollArea.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <motion.div 
      className="flex-1 overflow-hidden p-4 border rounded-lg mb-4 glass-card bg-card/30 backdrop-blur-sm shadow-md"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5 }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260,
                damping: 20,
                duration: 0.6 
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-vyanamana-400 to-vyanamana-600 flex items-center justify-center mb-6 shadow-lg"
            >
              <Bot className="h-8 w-8 text-white" />
            </motion.div>
            
            <motion.p 
              className="text-lg font-medium mb-4 text-vyanamana-500 dark:text-vyanamana-400"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {language === 'en' 
                ? 'Start chatting with Vyānamana'
                : 'व्यानमन के साथ चैट शुरू करें'}
            </motion.p>
            
            <motion.p 
              className="text-sm text-muted-foreground max-w-sm"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {language === 'en'
                ? 'Your mental wellness companion is here to listen, support, and guide you toward better wellbeing.'
                : 'आपका मानसिक कल्याण साथी यहां सुनने, समर्थन करने और बेहतर स्वास्थ्य की ओर मार्गदर्शन करने के लिए है।'}
            </motion.p>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-card/80 dark:bg-card/60 px-4 py-3 rounded-2xl shadow-sm">
                  <div className="flex space-x-2">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-vyanamana-500"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5] 
                      }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-vyanamana-500"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5] 
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-vyanamana-500"
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 1, 0.5] 
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>
    </motion.div>
  );
};

export default ChatContainer;
