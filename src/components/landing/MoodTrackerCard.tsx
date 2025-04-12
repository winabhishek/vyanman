
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const MoodTrackerCard: React.FC = () => {
  return (
    <Link to="/mood-tracker">
      <Card className="h-full backdrop-blur-lg bg-white/70 dark:bg-gray-800/50 border border-purple-100 dark:border-purple-900/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-violet-700 dark:text-violet-300">
            <Calendar className="mr-2 h-5 w-5" />
            Mood Tracker
          </CardTitle>
          <CardDescription>Track and understand your emotional patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-3 my-4">
            {['😔', '😐', '🙂', '😊', '😄'].map((emoji, index) => (
              <motion.div 
                key={index}
                className="text-2xl cursor-pointer rounded-full p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {emoji}
              </motion.div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/30 dark:to-blue-900/30 p-3 rounded-lg">
            <div className="grid grid-cols-7 gap-1 text-xs font-medium">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="text-center text-gray-500 dark:text-gray-400">{day}</div>
              ))}
              {Array.from({ length: 28 }).map((_, index) => (
                <motion.div 
                  key={index}
                  className={`h-6 rounded-full ${
                    index % 8 === 0 ? 'bg-green-200 dark:bg-green-800/40' : 
                    index % 7 === 3 ? 'bg-yellow-200 dark:bg-yellow-800/40' : 
                    index % 5 === 0 ? 'bg-blue-200 dark:bg-blue-800/40' : 
                    'bg-gray-100 dark:bg-gray-700/40'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" className="w-full justify-center group-hover:text-violet-600 dark:group-hover:text-violet-300">
            Track Your Mood
            <Activity className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MoodTrackerCard;
