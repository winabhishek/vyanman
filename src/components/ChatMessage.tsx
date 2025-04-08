
import React from 'react';
import { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThumbsUp, ThumbsDown, Meh } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const timestamp = message.timestamp instanceof Date 
    ? message.timestamp 
    : new Date(message.timestamp);
  
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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vyanamana-400 to-vyanamana-600 flex items-center justify-center shrink-0 mr-2">
          <span className="text-white font-bold text-sm">V</span>
        </div>
      )}
      <div className="flex flex-col">
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}>
          <p>{message.content}</p>
        </div>
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
    </div>
  );
};

export default ChatMessage;
