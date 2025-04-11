
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import AuthButton from './auth/AuthButton';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, MessageCircle, BarChart, Headphones, Smartphone 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: '/chat', label: t('nav.chat'), icon: <MessageCircle className="h-4 w-4" /> },
    { path: '/mood-tracker', label: t('nav.mood'), icon: <BarChart className="h-4 w-4" /> },
    { path: '/meditation', label: t('nav.meditation'), icon: <Headphones className="h-4 w-4" /> },
    { path: '/digital-detox', label: t('nav.detox'), icon: <Smartphone className="h-4 w-4" /> },
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vyanamana-400 to-vyanamana-600 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-heading font-bold text-xl gradient-heading">
            {t('app.name')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={location.pathname === link.path ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-1 relative overflow-hidden group hover:shadow-sm transition-shadow rounded-lg"
              >
                <span className="flex items-center gap-1">
                  {link.icon}
                  <span>{link.label}</span>
                </span>
                
                {location.pathname === link.path && (
                  <motion.div 
                    className="absolute bottom-0 left-0 h-0.5 w-full bg-vyanamana-500"
                    layoutId="navbar-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Button>
            </Link>
          ))}
          
          <div className="flex items-center ml-3 gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <AuthButton />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <LanguageToggle />
          <AuthButton />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            className="rounded-full hover:shadow-sm transition-shadow"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav className="flex flex-col gap-2 p-4 bg-background border-b border-border/40 shadow-md">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={closeMenu}>
                  <Button
                    variant={location.pathname === link.path ? "default" : "ghost"}
                    className="w-full justify-start gap-2 relative overflow-hidden hover:shadow-sm transition-shadow rounded-lg"
                  >
                    {link.icon}
                    {link.label}
                    
                    {location.pathname === link.path && (
                      <motion.div 
                        className="absolute bottom-0 left-0 h-0.5 w-full bg-vyanamana-500"
                        layoutId="navbar-indicator-mobile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Button>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
