import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/04602118-4a1a-43ab-ae66-6511477eabc7.png" 
                  alt="Vyanman Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-heading font-bold text-xl gradient-heading"><span className="vyanman-brand">Vyanman</span></span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your companion on the journey to mental well-being.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-4">Navigation</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-foreground transition-colors">
                  Chat
                </Link>
              </li>
              <li>
                <Link to="/mood-tracker" className="hover:text-foreground transition-colors">
                  Mood Tracker
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-sm mb-4">Emergency Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="tel:988" className="hover:text-foreground transition-colors">
                  988 - Suicide & Crisis Lifeline
                </a>
              </li>
              <li>
                <a href="tel:211" className="hover:text-foreground transition-colors">
                  211 - Health & Human Services
                </a>
              </li>
              <li>
                <a href="tel:18002738255" className="hover:text-foreground transition-colors">
                  1-800-273-8255 - National Suicide Prevention
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} <span className="vyanman-brand">Vyanman</span>. This app does not provide medical advice.</p>
          <p className="mt-2">
            If you are experiencing a mental health emergency, please call 988 or go to your nearest emergency room.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
