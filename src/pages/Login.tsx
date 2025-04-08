
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
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
          description: "You've successfully logged in.",
        });
      } else {
        await signup(name, email, password);
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
      }
      
      // Redirect to chat
      navigate('/chat');
    } catch (error) {
      toast({
        title: isLoginMode ? "Login failed" : "Signup failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGuestAccess = async () => {
    setIsSubmitting(true);
    
    try {
      await continueAsGuest();
      toast({
        title: "Anonymous session started",
        description: "You can now use Vyānamana without an account.",
      });
      
      // Redirect to chat
      navigate('/chat');
    } catch (error) {
      toast({
        title: "Failed to continue as guest",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vyanamana-400 to-vyanamana-600 flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">V</span>
        </div>
        <h1 className="text-2xl font-bold font-heading mb-2">
          {isLoginMode ? 'Welcome Back' : 'Create Your Account'}
        </h1>
        <p className="text-muted-foreground">
          {isLoginMode 
            ? 'Sign in to continue your mental wellbeing journey' 
            : 'Join Vyānamana to start your mental wellbeing journey'}
        </p>
      </div>
      
      <div className="bg-card border rounded-lg shadow-sm p-6">
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
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isLoginMode ? 'Signing In...' : 'Creating Account...') 
              : (isLoginMode ? 'Sign In' : 'Create Account')}
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
            className="w-full mt-4"
            onClick={handleGuestAccess}
            disabled={isSubmitting}
          >
            Continue as Guest
          </Button>
        </div>
        
        <div className="mt-6 text-center text-sm">
          {isLoginMode ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className="text-vyanamana-600 hover:text-vyanamana-700 font-medium"
                disabled={isSubmitting}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className="text-vyanamana-600 hover:text-vyanamana-700 font-medium"
                disabled={isSubmitting}
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          By using Vyānamana, you agree to our{' '}
          <Link to="/terms" className="underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
