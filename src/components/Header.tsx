
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import AuthButton from './auth/AuthButton';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, BarChart, Headphones, Smartphone, 
  Brain, Home, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the type for nav items
export interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

// Define props interface for Header component
interface HeaderProps {
  navItems?: NavItem[];
}

const Header: React.FC<HeaderProps> = ({ navItems: customNavItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Default nav links if no custom navItems are provided
  const defaultNavLinks = [
    { href: '/', label: t('nav.home'), icon: <Home className="h-4 w-4" /> },
    { href: '/mood-tracker', label: t('nav.mood'), icon: <BarChart className="h-4 w-4" /> },
    { href: '/meditation', label: t('nav.meditation'), icon: <Headphones className="h-4 w-4" /> },
    { href: '/digital-detox', label: t('nav.detox'), icon: <Smartphone className="h-4 w-4" /> },
    { href: '/cbt', label: t('nav.cbt'), icon: <Brain className="h-4 w-4" /> },
    { href: '/about', label: t('nav.about'), icon: <Info className="h-4 w-4" /> },
  ];

  // Use provided nav items or fall back to default ones
  const navLinks = customNavItems || defaultNavLinks;

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <motion.div 
            className="w-8 h-8 rounded-full bg-gradient-to-br from-vyanamana-400 to-vyanamana-600 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold text-sm">V</span>
          </motion.div>
          <motion.span 
            className="font-heading font-bold text-xl gradient-heading"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {t('app.name')}
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button
                variant={location.pathname === link.href ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-1 relative overflow-hidden group hover:shadow-sm transition-shadow rounded-lg"
              >
                <span className="flex items-center gap-1">
                  {link.icon}
                  <span>{link.label}</span>
                </span>
                
                {location.pathname === link.href && (
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
            <motion.div
              initial={false}
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
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
                <Link key={link.href} to={link.href} onClick={closeMenu}>
                  <Button
                    variant={location.pathname === link.href ? "default" : "ghost"}
                    className="w-full justify-start gap-2 relative overflow-hidden hover:shadow-sm transition-shadow rounded-lg"
                  >
                    {link.icon}
                    {link.label}
                    
                    {location.pathname === link.href && (
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
