
import React from 'react';
import { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const timestamp = message.timestamp instanceof Date 
    ? message.timestamp 
    : new Date(message.timestamp);
  
  // Check if message contains markdown-like syntax and apply simple formatting
  const formatMessage = (text: string): React.ReactNode => {
    // Handle bold text
    const boldRegex = /\*\*(.*?)\*\*/g;
    const processedText = text.split(boldRegex);
    
    if (processedText.length === 1) return text;
    
    return processedText.map((part, index) => {
      // Even indices are regular text, odd are bold text
      if (index % 2 === 0) {
        return part;
      } else {
        return <strong key={index}>{part}</strong>;
      }
    });
  };
  
  // Render sentiment icon based on sentiment score
  const renderSentimentIcon = () => {
    if (!message.sentiment) return null;
    
    const score = message.sentiment.score;
    
    if (score >= 4) {
      return <ThumbsUp className="h-4 w-4 text-green-500" />;
    } else if (score <= 2) {
      return <ThumbsDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Meh className="h-4 w-4 text-yellow-500" />;
    }
  };
  
  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 mr-2 shadow-sm">
          <span className="text-white font-bold text-sm">V</span>
        </div>
      )}
      <div className="flex flex-col max-w-[80%]">
        <motion.div 
          className={`${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'} shadow-sm`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="whitespace-pre-wrap">{formatMessage(message.content)}</p>
        </motion.div>
        <div className={`flex items-center gap-1 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {message.sentiment && isUser && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center">
                    {renderSentimentIcon()}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sentiment: {message.sentiment.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
