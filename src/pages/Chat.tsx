
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Send, RefreshCcw, Mic, Paperclip, Smile, Bot, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { vyanamanaPalette } from '@/utils/colorUtils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Mock initial messages
const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hello! I'm Vyānamana, your mental wellness companion. How are you feeling today?",
    isUser: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  }
];

// Typing animation component
const TypingIndicator = () => (
  <div className="flex space-x-1.5 p-2.5 px-4 rounded-full bg-muted/50 w-min">
    {[0, 1, 2].map((dot) => (
      <motion.div
        key={dot}
        className="w-2 h-2 rounded-full bg-vyanamana-400"
        animate={{
          y: ["0%", "-50%", "0%"]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "loop",
          delay: dot * 0.2
        }}
      />
    ))}
  </div>
);

// Message bubble component
const MessageBubble = ({ message }: { message: Message }) => {
  const { user } = useAuth();
  const isUser = message.isUser;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 500, damping: 10 }}
        >
          <Avatar className="mt-1">
            <AvatarImage src="/favicon.ico" />
            <AvatarFallback>
              <Bot className="text-vyanamana-600" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
      
      {isUser && (
        <motion.div 
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ type: "spring", stiffness: 500, damping: 10 }}
        >
          <Avatar className="mt-1">
            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user?.name || 'user'}`} />
            <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </motion.div>
      )}
      
      <div>
        <motion.div 
          className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-vyanamana-500 text-white shadow-md'
              : 'bg-secondary shadow-sm'
          }`}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          <p className="text-sm">{message.content}</p>
        </motion.div>
        <p className={`text-xs mt-1 text-muted-foreground ${isUser ? 'text-right' : ''}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Autoscroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Show a warning toast if no user is logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "You're in demo mode",
        description: "Log in to save your conversations and get personalized responses.",
        variant: "default",
      });
    }
  }, [user, toast]);
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate AI thinking
    setIsTyping(true);
    setIsLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      setIsTyping(false);
      setIsLoading(false);
      
      // Sample responses based on input
      let responseText = "I understand. How does that make you feel?";
      
      if (input.toLowerCase().includes('sad') || input.toLowerCase().includes('depress')) {
        responseText = "I'm sorry to hear you're feeling down. Would you like to try a quick mindfulness exercise to help with those feelings?";
      } else if (input.toLowerCase().includes('anxious') || input.toLowerCase().includes('stress')) {
        responseText = "Anxiety can be challenging. Let's take a moment to focus on your breathing. Try taking a few deep breaths with me.";
      } else if (input.toLowerCase().includes('happy') || input.toLowerCase().includes('good')) {
        responseText = "I'm glad to hear you're doing well! What's contributing to your positive mood today?";
      } else if (input.toLowerCase().includes('tired') || input.toLowerCase().includes('exhausted')) {
        responseText = "Feeling tired is common. Have you been able to maintain a regular sleep schedule lately?";
      } else if (input.toLowerCase().includes('help')) {
        responseText = "I'm here to support your mental wellness journey. Would you like to talk about your feelings, try some breathing exercises, or learn about mindfulness techniques?";
      } else if (input.trim() === '') {
        responseText = "I notice you sent an empty message. Is there something you'd like to talk about today?";
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: responseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Reset chat
  const handleResetChat = () => {
    setMessages(initialMessages);
    toast({
      title: "Chat reset",
      description: "Your conversation has been reset.",
      variant: "default",
    });
  };

  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div 
      className="container mx-auto max-w-4xl h-[calc(100vh-13rem)] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="py-4 px-4 flex justify-between items-center border-b mb-4 glass-card">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Avatar>
              <AvatarImage src="/favicon.ico" />
              <AvatarFallback>
                <Bot className="text-vyanamana-600" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <h2 className="font-semibold">Vyānamana</h2>
            <p className="text-xs text-muted-foreground">Your mental wellness companion</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleResetChat} title="Reset conversation">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Help">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 glass-card mb-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <p className="text-muted-foreground mb-2">No messages yet</p>
            <p className="text-sm text-muted-foreground">
              Start a conversation with Vyānamana, your mental wellness companion.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <MessageBubble message={message} />
              </div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <Avatar className="mt-1">
                    <AvatarImage src="/favicon.ico" />
                    <AvatarFallback>
                      <Bot className="text-vyanamana-600" />
                    </AvatarFallback>
                  </Avatar>
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t glass-card">
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="flex">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
                className="min-h-[60px] max-h-[120px] border-0 focus-visible:ring-0 resize-none"
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-between items-center px-3 py-2 bg-muted/30">
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Smile className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <Mic className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleSendMessage} 
                  size="sm"
                  className="gap-1 bg-vyanamana-500 hover:bg-vyanamana-600 relative overflow-hidden group"
                  disabled={input.trim() === '' || isLoading}
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                  <motion.div 
                    className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Chat;
