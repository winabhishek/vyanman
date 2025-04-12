
import React from 'react';
import { motion } from 'framer-motion';

interface ChatTypingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  background?: string;
}

const ChatTypingIndicator: React.FC<ChatTypingIndicatorProps> = ({ 
  size = 'md', 
  color = 'currentColor',
  background = 'bg-muted/50'
}) => {
  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };
  
  const containerPadding = {
    sm: 'p-1.5 px-3',
    md: 'p-2.5 px-4',
    lg: 'p-3 px-5'
  };
  
  const dotSpacing = {
    sm: 'space-x-1',
    md: 'space-x-1.5',
    lg: 'space-x-2'
  };

  return (
    <div className={`flex ${dotSpacing[size]} ${containerPadding[size]} rounded-full ${background} w-min`}>
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className={`${dotSize[size]} rounded-full`}
          style={{ backgroundColor: color }}
          animate={{
            y: ["0%", "-50%", "0%"]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "loop",
            delay: dot * 0.2
          }}
        />
      ))}
    </div>
  );
};

export default ChatTypingIndicator;
