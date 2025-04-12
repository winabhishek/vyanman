
import React from 'react';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-sm border-b border-lavender-200/20 dark:border-lavender-700/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">Vyānamana</span>
            </motion.div>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-6 mt-auto border-t border-lavender-200/20 dark:border-lavender-700/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 dark:text-gray-300">© {new Date().getFullYear()} Vyānamana. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
