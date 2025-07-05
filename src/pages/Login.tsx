
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const Login: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, signup, continueAsGuest, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/chat';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    
    try {
      if (isLoginMode) {
        await login(email, password);
        // Don't show toast here - it's handled in AuthContext
      } else {
        await signup(name, email, password);
        // Don't show toast here - it's handled in AuthContext
      }
      
      // Clear form only on success
      setEmail('');
      setPassword('');
      setName('');
      
      // Redirect handled by useEffect
    } catch (error) {
      console.error("Auth error:", error);
      // Toast already shown in AuthContext functions
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGuestAccess = async () => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    
    try {
      await continueAsGuest();
      // Don't show toast here - it's handled in AuthContext
      
      // Redirect to chat
      navigate('/chat');
    } catch (error) {
      // Toast already shown in AuthContext functions
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vyanmana-400 to-vyanmana-600 flex items-center justify-center mx-auto mb-4">
          <Brain className="text-white h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold font-heading mb-2">
          {isLoginMode ? 'Welcome Back' : 'Create Your Account'}
        </h1>
        <p className="text-muted-foreground">
          {isLoginMode 
            ? 'Sign in to continue your mental wellbeing journey' 
            : 'Join Vyanman to start your mental wellbeing journey'}
        </p>
      </motion.div>
      
      <motion.div 
        className="bg-card border rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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
                className="transition-all duration-200 focus:shadow-md"
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
              className="transition-all duration-200 focus:shadow-md"
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
              className="transition-all duration-200 focus:shadow-md"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-vyanmana-500 to-vyanmana-600 hover:from-vyanmana-600 hover:to-vyanmana-700 text-white relative overflow-hidden group"
            disabled={isSubmitting}
          >
            <span className="relative z-10">
              {isSubmitting 
                ? (isLoginMode ? 'Signing In...' : 'Creating Account...') 
                : (isLoginMode ? 'Sign In' : 'Create Account')}
            </span>
          </Button>
        </form>
        
        <div className="mt-6">
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
            className="w-full mt-4 border-vyanmana-400/50 hover:bg-vyanmana-500/10 relative overflow-hidden group"
            onClick={handleGuestAccess}
            disabled={isSubmitting}
          >
            <span className="relative z-10">Continue as Guest</span>
          </Button>
        </div>
        
        <div className="mt-6 text-center text-sm">
          {isLoginMode ? (
            <p>
              Don't have an account?{' '}
              <motion.button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className="text-vyanmana-600 hover:text-vyanmana-700 font-medium relative"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Sign up
              </motion.button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <motion.button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className="text-vyanmana-600 hover:text-vyanmana-700 font-medium relative"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Sign in
              </motion.button>
            </p>
          )}
        </div>
      </motion.div>
      
      <motion.div 
        className="mt-8 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <p>
          By using Vyanman, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-vyanmana-500 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-vyanmana-500 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
