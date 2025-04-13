
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, LogOut, User } from 'lucide-react';
import AuthModal from './AuthModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

const AuthButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive"
      });
    }
  };
  
  if (isAuthenticated && user) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button variant="ghost" size="icon" className="rounded-full relative overflow-hidden hover:shadow-md transition-shadow">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.email}`} />
                  <AvatarFallback>{user.email?.[0].toUpperCase() || 'G'}</AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-lg overflow-hidden backdrop-blur-sm bg-card/90">
            <DropdownMenuItem asChild>
              <button className="flex w-full items-center gap-2 cursor-pointer" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button className="flex w-full items-center gap-2 cursor-pointer text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <AuthModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </>
    );
  }
  
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => navigate('/login')}
          className="rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          <LogIn className="mr-2 h-4 w-4" />
          <span>Sign In</span>
        </Button>
      </motion.div>
      
      <AuthModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default AuthButton;
