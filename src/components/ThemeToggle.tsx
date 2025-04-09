
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        aria-label={t('theme.toggle')}
        className="glass-effect"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: theme === 'dark' ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="relative w-5 h-5"
        >
          {theme === 'dark' ? (
            <Sun className="absolute inset-0 h-5 w-5 text-yellow-400 transition-all" />
          ) : (
            <Moon className="absolute inset-0 h-5 w-5 text-deepPurple transition-all" />
          )}
        </motion.div>
        <span className="sr-only">{t('theme.toggle')}</span>
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;
