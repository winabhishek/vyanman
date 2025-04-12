
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, HeartPulse, Activity, Send, Music, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import FeedbackModal from '@/components/FeedbackModal';
import { useState } from 'react';
import BreathingCircle from '@/components/BreathingCircle';

const LandingPage: React.FC = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
    // Music playing logic would go here
  };

  return (
    <div className="pb-24 relative">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <motion.div 
          className="text-center max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
            Vyānamana
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Your AI-Powered Mental Wellness Companion
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg h-auto rounded-xl">
              Start Your Journey
              <HeartPulse className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-12">
        <motion.div 
          className="max-w-6xl mx-auto px-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
            Tools for Your Mental Wellbeing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mood Tracker Card */}
            <motion.div variants={item}>
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
            </motion.div>

            {/* AI Chat Companion Card */}
            <motion.div variants={item}>
              <Link to="/chat">
                <Card className="h-full backdrop-blur-lg bg-white/70 dark:bg-gray-800/50 border border-indigo-100 dark:border-indigo-900/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-indigo-700 dark:text-indigo-300">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      AI Chat Companion
                    </CardTitle>
                    <CardDescription>Talk about your feelings and get support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 my-4">
                      <div className="flex items-start">
                        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-t-xl rounded-br-xl max-w-[80%] text-left">
                          <p className="text-sm">How are you feeling today?</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="bg-violet-100 dark:bg-violet-900/40 p-3 rounded-t-xl rounded-bl-xl max-w-[80%] text-left">
                          <p className="text-sm">I've been feeling a bit anxious lately with work.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <motion.div 
                          className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-t-xl rounded-br-xl max-w-[80%] text-left"
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
                        className="w-full p-2 pl-3 pr-10 rounded-full bg-gray-100 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700"
                        disabled
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-500 dark:text-indigo-400 disabled:opacity-50" disabled>
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" className="w-full justify-center group-hover:text-indigo-600 dark:group-hover:text-indigo-300">
                      Start Chatting
                      <MessageSquare className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>

            {/* Meditation & Breathing Tools Card */}
            <motion.div variants={item}>
              <Link to="/meditation">
                <Card className="h-full backdrop-blur-lg bg-white/70 dark:bg-gray-800/50 border border-blue-100 dark:border-blue-900/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                      <Activity className="mr-2 h-5 w-5" />
                      Meditation & Breathing
                    </CardTitle>
                    <CardDescription>Relax with guided breathing exercises</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center my-4">
                      <BreathingCircle />
                    </div>
                    <div className="flex justify-center my-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMusic();
                        }}
                      >
                        {isMusicPlaying ? (
                          <>
                            <VolumeX className="h-4 w-4" />
                            Pause Music
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-4 w-4" />
                            Play Calm Music
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" className="w-full justify-center group-hover:text-blue-600 dark:group-hover:text-blue-300">
                      Begin Meditation
                      <Music className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Floating Feedback Button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button 
              className="rounded-full w-14 h-14 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 shadow-lg hover:shadow-xl"
              onClick={() => setIsFeedbackOpen(true)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-2">
            <p className="text-sm">Share your feedback about Vyānamana</p>
          </HoverCardContent>
        </HoverCard>
      </motion.div>

      {/* Feedback Modal */}
      {isFeedbackOpen && <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />}
    </div>
  );
};

export default LandingPage;
