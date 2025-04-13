
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isLoginMode) {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        await signup(name, email, password);
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        });
      }
      
      onClose();
      navigate('/chat');
    } catch (error) {
      // Toast already shown in AuthContext functions
      setIsSubmitting(false);
    }
  };

  const handleGuestAccess = async () => {
    setIsSubmitting(true);
    
    try {
      await continueAsGuest();
      onClose();
      navigate('/chat');
    } catch (error) {
      // Toast already shown in AuthContext functions
      setIsSubmitting(false);
    }
  };
  
  const handleModeToggle = () => {
    setIsLoginMode(!isLoginMode);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl shadow-lg overflow-hidden bg-card backdrop-blur-sm bg-card/90">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            {isLoginMode ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLoginMode 
              ? "Sign in to continue your mental wellbeing journey" 
              : "Join us to start your mental wellbeing journey"}
          </DialogDescription>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-full hover:bg-muted transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 py-3"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLoginMode}
                  disabled={isSubmitting}
                  className="h-10 rounded-md transition-shadow focus:shadow-md"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-10 rounded-md transition-shadow focus:shadow-md"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-10 rounded-md transition-shadow focus:shadow-md"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-10 rounded-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              disabled={isSubmitting}
            >
              <span className="relative z-10">
                {isSubmitting 
                  ? (isLoginMode ? "Signing in..." : "Creating account...") 
                  : (isLoginMode ? "Sign In" : "Create Account")}
              </span>
              <span className="absolute inset-0 bg-vyanamana-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></span>
            </Button>
          </form>
          
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or</span>
              </div>
            </div>
            
            <Button
              variant="outline" 
              className="w-full mt-4 h-10 rounded-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              onClick={handleGuestAccess}
              disabled={isSubmitting}
            >
              <span className="relative z-10">Continue as Guest</span>
              <span className="absolute inset-0 bg-vyanamana-50 dark:bg-vyanamana-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md"></span>
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLoginMode ? "Don't have an account? " : "Already have an account? "}
              <motion.button
                type="button"
                onClick={handleModeToggle}
                className="font-medium text-primary hover:underline focus:outline-none"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {isLoginMode ? "Sign up" : "Sign in"}
              </motion.button>
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
