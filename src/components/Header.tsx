
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/LanguageToggle';
import ThemeToggle from '@/components/ThemeToggle';
import AuthButton from '@/components/auth/AuthButton';
import { Brain, Heart, Compass, MessageCircle, User, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { 
      href: '/chat', 
      label: language === 'en' ? 'AI Chat' : 'AI चैट',
      icon: MessageCircle,
      badge: language === 'en' ? 'New AI' : 'नया AI',
      highlight: false
    },
    { 
      href: '/enhanced-cbt', 
      label: language === 'en' ? 'Smart CBT' : 'स्मार्ट CBT',
      icon: Brain,
      badge: language === 'en' ? 'AI Enhanced' : 'AI संवर्धित',
      highlight: true   // we keep it highlighted in a brand color style (no blue)
    },
    { 
      href: '/mood-tracker', 
      label: language === 'en' ? 'Mood' : 'मूड',
      icon: Heart,
      highlight: false
    },
    { 
      href: '/meditation', 
      label: language === 'en' ? 'Meditation' : 'ध्यान',
      icon: Compass,
      highlight: false
    }
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-r from-vyanmana-600 to-vyanmana-950 rounded-lg flex items-center justify-center">
            {/* Brand Color Icon */}
            <Brain className="h-5 w-5 text-vyanmana-400" />
          </div>
          <span className="font-bold text-xl gradient-heading">Vyanman</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button 
                variant="ghost" 
                className={`flex items-center gap-2 relative transition-colors duration-200 ${
                  item.highlight
                  ? 'bg-gradient-to-r from-vyanmana-400/10 to-amber-500/10 hover:from-vyanmana-400/20 hover:to-amber-500/20'
                  : 'hover:bg-vyanmana-400/10'
                }`}
              >
                <item.icon className={`h-4 w-4 ${item.highlight ? 'text-vyanmana-500' : 'text-vyanmana-700'}`} />
                {item.label}
                {item.badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${
                    item.highlight
                      ? 'bg-gradient-to-r from-vyanmana-600 to-amber-600'
                      : 'bg-vyanmana-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <Sparkles className="h-3 w-3 text-amber-400 absolute -top-1 -right-1" />
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
              <User className="h-4 w-4 text-vyanmana-700" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

