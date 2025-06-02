
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { MessageCircle } from 'lucide-react';

interface FeedbackButtonProps {
  onClick: () => void;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ onClick }) => {
  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5 }}
    >
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button 
            className="rounded-full w-14 h-14 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 shadow-lg hover:shadow-xl"
            onClick={onClick}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-2">
          <p className="text-sm">Share your feedback about <span className="vyanman-brand">Vyanman</span></p>
        </HoverCardContent>
      </HoverCard>
    </motion.div>
  );
};

export default FeedbackButton;
