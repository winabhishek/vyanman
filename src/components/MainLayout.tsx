
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { language } = useLanguage();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Determine title based on route
  const getPageTitle = (): string => {
    const baseTitle = 'Vyanman';
    const route = location.pathname;
    
    if (language === 'en') {
      if (route === '/') return `${baseTitle} - Mental Health Companion`;
      if (route === '/chat') return `${baseTitle} - Chat with AI`;
      if (route === '/mood-tracker') return `${baseTitle} - Mood Tracker`;
      if (route === '/meditation') return `${baseTitle} - Meditation`;
      if (route === '/digital-detox') return `${baseTitle} - Digital Detox`;
      if (route === '/cbt') return `${baseTitle} - Cognitive Behavioral Therapy`;
      if (route === '/login') return `${baseTitle} - Login`;
      if (route === '/about') return `${baseTitle} - About Us`;
      if (route === '/profile') return `${baseTitle} - Your Profile`;
      return baseTitle;
    } else {
      if (route === '/') return `${baseTitle} - मानसिक स्वास्थ्य साथी`;
      if (route === '/chat') return `${baseTitle} - AI से चैट करें`;
      if (route === '/mood-tracker') return `${baseTitle} - मूड ट्रैकर`;
      if (route === '/meditation') return `${baseTitle} - ध्यान`;
      if (route === '/digital-detox') return `${baseTitle} - डिजिटल डिटॉक्स`;
      if (route === '/cbt') return `${baseTitle} - संज्ञानात्मक व्यवहार थेरेपी`;
      if (route === '/login') return `${baseTitle} - लॉगिन`;
      if (route === '/about') return `${baseTitle} - हमारे बारे में`;
      if (route === '/profile') return `${baseTitle} - आपका प्रोफाइल`;
      return baseTitle;
    }
  };

  return (
    <motion.div 
      className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content="Vyanman - AI Mental Health Companion" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      
      <Header />
      
      <motion.main 
        className="flex-grow pt-20 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.main>
      
      <Footer />
    </motion.div>
  );
};

export default MainLayout;
