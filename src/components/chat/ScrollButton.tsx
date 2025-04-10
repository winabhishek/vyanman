
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface ScrollButtonProps {
  onClick: () => void;
  visible: boolean;
}

const ScrollButton: React.FC<ScrollButtonProps> = ({ onClick, visible }) => {
  const { language } = useLanguage();
  
  if (!visible) return null;
  
  return (
    <motion.div 
      className="flex justify-center mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="flex items-center gap-2"
      >
        <ArrowUp className="h-4 w-4" />
        {language === 'en' ? 'Scroll to bottom' : 'नीचे स्क्रॉल करें'}
      </Button>
    </motion.div>
  );
};

export default ScrollButton;
