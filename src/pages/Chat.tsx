
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Send, RefreshCcw, Mic, Paperclip, Smile, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { vyanamanaPalette } from '@/utils/colorUtils';

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

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Autoscroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
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
    
    // Simulate AI response after a delay
    setTimeout(() => {
      setIsTyping(false);
      
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

  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Message variants for animations
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="container mx-auto max-w-4xl h-[calc(100vh-13rem)] flex flex-col">
      <div className="py-4 px-4 flex justify-between items-center border-b mb-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/favicon.ico" />
            <AvatarFallback>
              <Bot className="text-vyanamana-600" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">Vyānamana</h2>
            <p className="text-xs text-muted-foreground">Your mental wellness companion</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                {!message.isUser && (
                  <Avatar className="mt-1">
                    <AvatarImage src="/favicon.ico" />
                    <AvatarFallback>
                      <Bot className="text-vyanamana-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                {message.isUser && (
                  <Avatar className="mt-1">
                    <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user?.name || 'user'}`} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                )}
                
                <div>
                  <div 
                    className={`px-4 py-3 rounded-2xl ${
                      message.isUser 
                        ? 'bg-vyanamana-500 text-white'
                        : 'bg-secondary'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-xs mt-1 text-muted-foreground ${message.isUser ? 'text-right' : ''}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
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
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-4 border-t">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-[60px] max-h-[120px] border-0 focus-visible:ring-0 resize-none"
              />
            </div>
            <div className="flex justify-between items-center px-3 py-2 bg-muted/30">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                onClick={handleSendMessage} 
                size="sm"
                className="gap-1 bg-vyanamana-500 hover:bg-vyanamana-600"
                disabled={input.trim() === ''}
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
