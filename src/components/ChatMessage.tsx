
import React from 'react';
import { Message } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const timestamp = message.timestamp instanceof Date 
    ? message.timestamp 
    : new Date(message.timestamp);
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="flex flex-col">
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}>
          <p>{message.content}</p>
        </div>
        <span className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
