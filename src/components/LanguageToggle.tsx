
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="flex items-center gap-2 glass-effect px-3"
        aria-label="Toggle language"
      >
        <Globe className="h-4 w-4 text-vyanamana-500" />
        <span className="font-medium text-sm">
          {language === 'en' ? 'EN' : 'हिं'}
        </span>
      </Button>
    </motion.div>
  );
};

export default LanguageToggle;
