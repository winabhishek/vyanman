
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import AuthButton from '@/components/auth/AuthButton';
import { MessageCircle, Brain, Heart, Compass, User, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { 
      href: '/chat', 
      label: language === 'en' ? 'AI Chat' : 'AI चैट',
      icon: MessageCircle,
      badge: language === 'en' ? 'New AI' : 'नया AI'
    },
    { 
      href: '/enhanced-cbt', 
      label: language === 'en' ? 'Smart CBT' : 'स्मार्ट CBT',
      icon: Brain,
      badge: language === 'en' ? 'AI Enhanced' : 'AI संवर्धित',
      highlight: true
    },
    { 
      href: '/mood-tracker', 
      label: language === 'en' ? 'Mood' : 'मूड',
      icon: Heart
    },
    { 
      href: '/meditation', 
      label: language === 'en' ? 'Meditation' : 'ध्यान',
      icon: Compass
    }
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl gradient-heading">Vyanman</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button 
                variant="ghost" 
                className={`flex items-center gap-2 relative ${
                  item.highlight ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20' : ''
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${
                    item.highlight ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-blue-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <Sparkles className="h-3 w-3 text-purple-500 absolute -top-1 -right-1" />
                )}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <LanguageToggle />
          <ThemeToggle />
          <AuthButton />
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/profile')}
              className="hidden md:flex"
            >
              <User className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
