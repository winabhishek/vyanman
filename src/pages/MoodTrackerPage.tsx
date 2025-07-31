
import React, { useState, useEffect } from 'react';
import MoodTracker from '@/components/MoodTracker';
import MoodHistory from '@/components/MoodHistory';
import MoodDashboard from '@/components/mood/MoodDashboard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, BarChart3, History, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { moodAPI } from '@/services';
import { MoodEntry } from '@/types';

const MoodTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const fetchMoodEntries = async () => {
    try {
      setLoading(true);
      const entries = await moodAPI.getMoodEntries();
      setMoodEntries(entries);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMoodEntries();
  }, []);
  
  const handleMoodLogged = () => {
    fetchMoodEntries();
  };
  
  return (
    <motion.div 
      className="container mx-auto max-w-7xl px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-heading mb-2">
            {language === 'en' ? 'Mood Intelligence' : 'मूड इंटेलिजेंस'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Track, analyze, and understand your emotional patterns' 
              : 'अपने भावनात्मक पैटर्न को ट्रैक करें, विश्लेषण करें और समझें'
            }
          </p>
        </div>
        <Button 
          onClick={() => navigate('/chat')}
          className="flex items-center gap-2 bg-gradient-premium shadow-premium hover:shadow-lg"
        >
          <MessageCircle className="h-4 w-4" />
          {t('nav.chat')}
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {language === 'en' ? 'Dashboard' : 'डैशबोर्ड'}
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {language === 'en' ? 'Log Mood' : 'मूड लॉग करें'}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              {language === 'en' ? 'History' : 'इतिहास'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <MoodDashboard 
              moodEntries={moodEntries} 
              onRefresh={fetchMoodEntries}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="tracker" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent -z-10 rounded-3xl blur-3xl"></div>
              <MoodTracker onMoodLogged={handleMoodLogged} />
            </motion.div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="glass-card p-6 rounded-2xl">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <MoodHistory moodEntries={moodEntries} />
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default MoodTrackerPage;
