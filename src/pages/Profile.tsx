
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoodEntry } from '@/types';
import { moodAPI } from '@/services';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Settings, LogOut, Clock, Activity, BarChart } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('mood');

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
  
  // Format account creation date safely
  const getFormattedJoinDate = () => {
    // Check if user exists and has a createdAt property that can be converted to a date
    if (user && 'createdAt' in user && user.createdAt) {
      try {
        return format(new Date(user.createdAt as string), 'MMM dd, yyyy');
      } catch (error) {
        return 'Today';
      }
    }
    return 'Today';
  };
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please login to view your profile</h1>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  // Tabs data
  const tabs = [
    { id: 'mood', label: 'Mood History', icon: <Activity size={18} /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart size={18} /> },
    { id: 'activity', label: 'Recent Activity', icon: <Clock size={18} /> },
  ];

  return (
    <motion.div 
      className="container mx-auto max-w-6xl px-4 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold gradient-heading mb-2">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account and view your wellness journey</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - User Profile */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="glass-card overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-vyanamana-400 to-vyanamana-600" />
            <div className="-mt-12 flex justify-center">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user?.name || 'anonymous'}`} />
                <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
            </div>
            
            <CardHeader className="text-center pt-2 pb-2">
              <CardTitle className="text-xl">{user?.name || 'Anonymous User'}</CardTitle>
              <p className="text-sm text-muted-foreground">{user?.email || 'Guest User'}</p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar size={14} /> Joined
                  </span>
                  <span>{getFormattedJoinDate()}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Mood Entries</span>
                  <span className="font-medium">{moodEntries.length}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="px-2 py-1 rounded text-xs bg-vyanamana-500/10 text-vyanamana-500">
                    {user?.isAnonymous ? 'Anonymous' : 'Member'}
                  </span>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Settings size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                  
                  <Button 
                    onClick={logout}
                    variant="destructive"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <LogOut size={16} className="mr-2" />
                    {t('nav.logout')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Main Content */}
        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
          {/* Mood Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="glass-card bg-gradient-to-br from-vyanamana-900/20 to-vyanamana-800/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-vyanamana-500/10 p-3 rounded-lg">
                    <span className="text-3xl">{getMoodEmoji(mostCommonMood.mood)}</span>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Most Common Mood</p>
                    <p className="font-semibold capitalize text-lg">{mostCommonMood.mood}</p>
                    <p className="text-xs text-muted-foreground">{mostCommonMood.count} entries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card bg-gradient-to-br from-vyanamana-900/20 to-vyanamana-800/20">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">Average Mood</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{averageMoodScore}/5</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <div 
                          key={score} 
                          className={`w-2 h-8 mx-0.5 rounded-sm ${
                            score <= Math.round(averageMoodScore) 
                              ? 'bg-vyanamana-500' 
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card bg-gradient-to-br from-vyanamana-900/20 to-vyanamana-800/20">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">Consistency</p>
                  <div className="pt-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Last 7 days</span>
                      <span>{Math.min(moodEntries.length, 7)}/7 days</span>
                    </div>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 h-2 rounded-full ${
                            i < Math.min(moodEntries.length, 7) 
                              ? 'bg-vyanamana-500' 
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs for different content sections */}
          <Card className="glass-card">
            <CardHeader className="pb-0">
              <div className="flex gap-1 border-b">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    size="sm"
                    className={`rounded-none border-b-2 ${
                      activeTab === tab.id 
                        ? 'border-vyanamana-500 text-foreground' 
                        : 'border-transparent text-muted-foreground'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="flex items-center gap-1.5">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="max-h-[400px] overflow-y-auto">
              {activeTab === 'mood' && (
                isLoading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading mood history...</p>
                ) : moodEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No mood entries yet</p>
                    <Button 
                      onClick={() => navigate('/mood-tracker')}
                      variant="outline"
                    >
                      Record Your First Mood
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {moodEntries.map((entry) => (
                      <motion.div 
                        key={entry.id}
                        className="flex items-center py-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="mr-4 text-3xl">{getMoodEmoji(entry.mood)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium capitalize">{entry.mood}</p>
                          {entry.note && (
                            <p className="text-sm text-muted-foreground truncate">{entry.note}</p>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(entry.timestamp), 'MMM dd, HH:mm')}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              )}
              
              {activeTab === 'stats' && (
                <div className="py-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-1">Mood Distribution</h3>
                    <p className="text-sm text-muted-foreground">Based on your {moodEntries.length} mood entries</p>
                  </div>
                  
                  {moodEntries.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No data available yet</p>
                      <Button 
                        onClick={() => navigate('/mood-tracker')}
                        variant="outline"
                      >
                        Record Your First Mood
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {
                        Object.entries(
                          moodEntries.reduce((acc, entry) => {
                            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        )
                        .sort((a, b) => b[1] - a[1])
                        .map(([mood, count]) => {
                          const percentage = Math.round((count / moodEntries.length) * 100);
                          return (
                            <div key={mood} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize flex items-center gap-1.5">
                                  <span>{getMoodEmoji(mood)}</span>
                                  <span>{mood}</span>
                                </span>
                                <span className="text-muted-foreground">{count} entries ({percentage}%)</span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-vyanamana-500 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'activity' && (
                <div className="py-4">
                  <h3 className="text-lg font-semibold mb-4 text-center">Recent Activity</h3>
                  
                  {/* This would be filled with actual user activity data */}
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground py-8">
                      Activity tracking coming soon!
                    </p>
                  </div>
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
