
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MessageCircle, Send, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ChatCompanionCard: React.FC = () => {
  return (
    <Link to="/chat">
      <Card className="h-full backdrop-blur-lg bg-white/70 dark:bg-gray-800/50 border border-vyanamana-100 dark:border-vyanamana-900/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-vyanamana-700 dark:text-vyanamana-300">
            <MessageCircle className="mr-2 h-5 w-5" />
            AI Chat Companion
          </CardTitle>
          <CardDescription>Talk about your feelings and get support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 my-4">
            <div className="flex items-start">
              <div className="bg-vyanamana-100 dark:bg-vyanamana-900/40 p-3 rounded-t-xl rounded-br-xl max-w-[80%] text-left">
                <p className="text-sm">How are you feeling today?</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-t-xl rounded-bl-xl max-w-[80%] text-left">
                <p className="text-sm">I've been feeling a bit anxious lately with work.</p>
              </div>
            </div>
            <div className="flex items-start">
              <motion.div 
                className="bg-vyanamana-100 dark:bg-vyanamana-900/40 p-3 rounded-t-xl rounded-br-xl max-w-[80%] text-left"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-sm">I understand. Let's talk about what's causing your anxiety and explore some relaxation techniques...</p>
              </motion.div>
            </div>
          </div>
          <div className="relative mt-2">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="w-full p-2 pl-3 pr-10 rounded-full bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-vyanamana-300 dark:focus:ring-vyanamana-700"
              disabled
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-vyanamana-500 dark:text-vyanamana-400 disabled:opacity-50" disabled>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" className="w-full justify-center group-hover:text-vyanamana-600 dark:group-hover:text-vyanamana-300">
            Start Chatting
            <MessageSquare className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ChatCompanionCard;
