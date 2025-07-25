import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Heart, Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const FooterNew: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Github, href: '#', label: 'Github' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@vyanamana.com', label: 'Email' }
  ];
  
  return (
    <footer className="w-full bg-background border-t border-border/40 py-8 md:py-12 mt-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/1bc785b7-5504-4cf1-a065-d957430f5da4.png" 
                  alt="Vyanman Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <motion.span 
                className="font-heading font-bold text-xl text-gradient"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="vyanman-brand">Vyanman</span>
              </motion.span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your companion on the journey to mental well-being through mindfulness and self-reflection.
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social, index) => (
                <HoverCard key={social.label}>
                  <HoverCardTrigger asChild>
                    <a 
                      href={social.href}
                      aria-label={social.label}
                      className="h-8 w-8 flex items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:text-primary hover:bg-muted transition-colors shadow-sm hover:shadow-md"
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto p-2 text-xs">
                    {social.label}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-3">Navigation</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/chat" className="text-muted-foreground hover:text-foreground transition-colors">Chat</Link>
              <Link to="/mood-tracker" className="text-muted-foreground hover:text-foreground transition-colors">Mood Tracker</Link>
              <Link to="/meditation" className="text-muted-foreground hover:text-foreground transition-colors">Meditation</Link>
              <Link to="/digital-detox" className="text-muted-foreground hover:text-foreground transition-colors">Digital Detox</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
            </nav>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-3">Resources</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </nav>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-3">Emergency Resources</h3>
            <div className="flex flex-col space-y-2 text-sm">
              <a href="tel:988" className="text-muted-foreground hover:text-foreground transition-colors">
                988 - Suicide & Crisis Lifeline
              </a>
              <a href="tel:211" className="text-muted-foreground hover:text-foreground transition-colors">
                211 - Health & Human Services
              </a>
              <a href="tel:18002738255" className="text-muted-foreground hover:text-foreground transition-colors">
                1-800-273-8255 - National Suicide Prevention
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} <span className="vyanman-brand">Vyanman</span>. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> for better mental health
          </p>
        </div>
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>This app does not provide medical advice. If you are experiencing a mental health emergency, please call 988 or go to your nearest emergency room.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
