
import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Declare the useState hook correctly
  const [theme, setTheme] = useState<Theme>('light');
  
  // Initialize theme from localStorage or system preference on client-side only
  useEffect(() => {
    // First check localStorage
    const savedTheme = localStorage.getItem('vyanamana-theme');
    
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme as Theme);
    }
    // Then check media query
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);
  
  // Listen for system theme preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      // Only update if user hasn't set a preference
      if (!localStorage.getItem('vyanamana-theme')) {
        setTheme(newTheme);
      }
    };
    
    // Add event listener for theme changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);
  
  // Apply theme class to document
  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('vyanamana-theme', theme);
    
    // Update document's class list with animation
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Add transition class temporarily
    root.classList.add('theme-transition');
    
    // Remove transition class after transition completes to prevent transition on page load
    const timer = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen transition-colors duration-500 ease-in-out"
      >
        {children}
      </motion.div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
