
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const MoodTrackerCard: React.FC = () => {
  return (
    <Link to="/mood-tracker">
      <Card className="h-full backdrop-blur-lg bg-white/70 dark:bg-gray-800/50 border border-vyanmana-100 dark:border-vyanmana-900/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-vyanmana-700 dark:text-vyanmana-300">
            <Heart className="mr-2 h-5 w-5 text-red-500" />
            Mood Tracker
          </CardTitle>
          <CardDescription>Track your emotional journey and discover patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-2 my-4">
            {[
              { emoji: '😄', color: 'from-yellow-400 to-orange-400' },
              { emoji: '😊', color: 'from-green-400 to-emerald-400' },
              { emoji: '😐', color: 'from-gray-400 to-slate-400' },
              { emoji: '😢', color: 'from-blue-600 to-indigo-600' },
              { emoji: '😠', color: 'from-red-500 to-rose-500' }
            ].map((mood, index) => (
              <motion.div 
                key={index}
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${mood.color} flex items-center justify-center cursor-pointer shadow-md`}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-lg">{mood.emoji}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-vyanmana-100 to-amber-100 dark:from-vyanmana-900/30 dark:to-amber-900/30 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-vyanmana-700 dark:text-vyanmana-300">Weekly Progress</span>
              <TrendingUp className="h-4 w-4 text-vyanmana-600 dark:text-vyanmana-400" />
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs font-medium">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <div key={index} className="text-center text-gray-500 dark:text-gray-400 mb-1">{day}</div>
              ))}
              {Array.from({ length: 21 }).map((_, index) => (
                <motion.div 
                  key={index}
                  className={`h-3 rounded-full ${
                    index % 7 === 0 ? 'bg-yellow-400' : 
                    index % 5 === 2 ? 'bg-green-400' : 
                    index % 4 === 0 ? 'bg-blue-400' : 
                    index % 6 === 1 ? 'bg-red-400' :
                    'bg-gray-200 dark:bg-gray-700'
                  } shadow-sm`}
                  whileHover={{ scale: 1.3 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="ghost" className="w-full justify-center group-hover:text-vyanmana-600 dark:group-hover:text-vyanmana-300 transition-colors">
            Start Tracking
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default MoodTrackerCard;
