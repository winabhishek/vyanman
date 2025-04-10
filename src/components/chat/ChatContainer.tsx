
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types';
import ChatMessage from '@/components/ChatMessage';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading, messagesEndRef }) => {
  const { language } = useLanguage();

  return (
    <motion.div 
      className="flex-1 overflow-hidden p-4 border rounded-lg mb-4 glass-card bg-card/30 backdrop-blur-sm"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5 }
        }
      }}
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
  );
};

export default ChatContainer;
