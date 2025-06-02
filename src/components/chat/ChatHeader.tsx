
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const ChatHeader: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <motion.div 
      className="flex justify-between items-center mb-6"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5 }
        }
      }}
    >
      <h1 className="text-2xl font-bold font-heading gradient-heading">
        {language === 'en' ? (
          <>Chat with <span className="vyanman-brand">Vyanman</span></>
        ) : (
          <><span className="vyanman-brand">Vyanman</span> से चैट करें</>
        )}
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
  );
};

export default ChatHeader;
