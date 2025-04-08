
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoodEntry } from '@/types';
import { moodAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMoodEntries = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      try {
        const entries = await moodAPI.getMoodEntries();
        setMoodEntries(entries);
      } catch (error) {
        console.error('Error fetching mood entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMoodEntries();
  }, [isAuthenticated, navigate]);

  // Get mood emoji
  const getMoodEmoji = (mood: string): string => {
    const moodEmojis: Record<string, string> = {
      joyful: '😄',
      happy: '😊',
      content: '🙂',
      neutral: '😐',
      sad: '😔',
      anxious: '😰',
      stressed: '😫',
      angry: '😠',
      exhausted: '😴'
    };
    
    return moodEmojis[mood] || '🙂';
  };

  // Get most common mood
  const getMostCommonMood = (): { mood: string, count: number } => {
    if (moodEntries.length === 0) {
      return { mood: 'neutral', count: 0 };
    }
    
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
      a[1] > b[1] ? a : b
    );
    
    return { mood: mostCommonMood[0], count: mostCommonMood[1] };
  };

  // Get average mood score
  const getAverageMoodScore = (): number => {
    if (moodEntries.length === 0) {
      return 0;
    }
    
    const moodScores: Record<string, number> = {
      joyful: 5,
      happy: 4,
      content: 3,
      neutral: 2,
      sad: 1,
      anxious: 1,
      stressed: 1,
      angry: 1,
      exhausted: 1
    };
    
    const totalScore = moodEntries.reduce((acc, entry) => 
      acc + (moodScores[entry.mood] || 0), 0);
      
    return Number((totalScore / moodEntries.length).toFixed(1));
  };

  const mostCommonMood = getMostCommonMood();
  const averageMoodScore = getAverageMoodScore();
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="container mx-auto max-w-4xl px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold font-heading gradient-heading mb-2">{t('profile.title')}</h1>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="md:col-span-1">
          <Card className="glass-card h-full">
            <CardHeader className="text-center pb-2">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user?.name || 'anonymous'}`} />
                <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{user?.name || 'Anonymous User'}</CardTitle>
              <p className="text-sm text-muted-foreground">{user?.email || 'Guest User'}</p>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Account Type:</span>
                  <span className="font-medium">{user?.isAnonymous ? 'Anonymous' : 'Registered'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium">
                    {user?.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'Today'}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Mood Entries:</span>
                  <span className="font-medium">{moodEntries.length}</span>
                </div>
                
                <div className="mt-8">
                  <Button 
                    onClick={logout}
                    variant="destructive"
                    className="w-full"
                  >
                    {t('nav.logout')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle>{t('profile.stats')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Most Common Mood</p>
                  <div className="flex items-center mt-1">
                    <span className="text-3xl mr-2">{getMoodEmoji(mostCommonMood.mood)}</span>
                    <div>
                      <p className="font-medium capitalize">{mostCommonMood.mood}</p>
                      <p className="text-xs text-muted-foreground">
                        {mostCommonMood.count} times
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Average Mood</p>
                  <div className="flex items-center mt-1">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Low</span>
                        <span className="text-xs text-muted-foreground">High</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-vyanamana-500" 
                          style={{width: `${(averageMoodScore / 5) * 100}%`}}
                        />
                      </div>
                      <p className="text-center mt-1 font-medium">{averageMoodScore}/5</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>{t('profile.mood.history')}</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <p className="text-center py-4 text-muted-foreground">Loading...</p>
              ) : moodEntries.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">{t('mood.nodata')}</p>
              ) : (
                <div className="space-y-2">
                  {moodEntries.slice(0, 10).map((entry) => (
                    <motion.div 
                      key={entry.id}
                      className="flex items-center p-2 border-b last:border-b-0"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-2xl mr-3">{getMoodEmoji(entry.mood)}</span>
                      <div className="flex-1">
                        <p className="font-medium capitalize">{entry.mood}</p>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground truncate max-w-[300px]">{entry.note}</p>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(entry.timestamp), 'MMM dd, HH:mm')}
                      </p>
                    </motion.div>
                  ))}
                  
                  {moodEntries.length > 10 && (
                    <div className="text-center pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate('/mood-tracker')}
                      >
                        View All
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
