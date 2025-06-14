
import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-full"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 0 : 180,
          opacity: theme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.5 }}
        className="absolute h-full w-full flex items-center justify-center"
      >
        <Moon className="h-5 w-5" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'light' ? 0 : -180,
          opacity: theme === 'light' ? 1 : 0
        }}
        transition={{ duration: 0.5 }}
        className="absolute h-full w-full flex items-center justify-center"
      >
        <Sun className="h-5 w-5" />
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
