import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { moodAPI } from '@/services';
import { MoodEntry, Mood } from '@/types';
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Target,
  Sparkles,
  Brain,
  Heart,
  Activity,
  Clock,
  Award,
  Lightbulb
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays, isAfter, startOfDay } from 'date-fns';

interface MoodDashboardProps {
  moodEntries: MoodEntry[];
  onRefresh: () => void;
  loading?: boolean;
}

const MoodDashboard: React.FC<MoodDashboardProps> = ({ 
  moodEntries, 
  onRefresh, 
  loading = false 
}) => {
  const { language, t } = useLanguage();
  const [analytics, setAnalytics] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await moodAPI.getMoodAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching mood analytics:', error);
      }
    };

    fetchAnalytics();
  }, [moodEntries]);

  // Generate mood trend data for the last 7 or 30 days
  const getMoodTrendData = () => {
    const days = viewMode === 'week' ? 7 : 30;
    const dateRange = Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      return startOfDay(date);
    });

    return dateRange.map(date => {
      const dayEntries = moodEntries.filter(entry => 
        format(new Date(entry.timestamp), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );

      const moodValues: Record<Mood, number> = {
        joyful: 5,
        happy: 4,
        content: 3.5,
        neutral: 2.5,
        sad: 1.5,
        anxious: 1,
        stressed: 1,
        angry: 0.5,
        exhausted: 1
      };

      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / dayEntries.length
        : null;

      return {
        date: format(date, 'MMM dd'),
        fullDate: date,
        mood: avgMood,
        entries: dayEntries.length
      };
    });
  };

  // Mood distribution data for pie chart
  const getMoodDistribution = () => {
    if (!analytics) return [];

    const colors = {
      joyful: '#fbbf24',
      happy: '#10b981',
      content: '#3b82f6',
      neutral: '#6b7280',
      sad: '#4f46e5',
      anxious: '#8b5cf6',
      angry: '#ef4444',
      exhausted: '#f59e0b',
      stressed: '#8b5cf6'
    };

    return Object.entries(analytics.moodCounts)
      .filter(([_, count]) => (count as number) > 0)
      .map(([mood, count]) => ({
        name: language === 'en' ? mood : getMoodLabel(mood),
        value: count,
        color: colors[mood as Mood] || '#6b7280'
      }));
  };

  // Weekly mood pattern
  const getWeeklyPattern = () => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return weekdays.map(day => {
      const dayEntries = moodEntries.filter(entry => {
        const entryDay = format(new Date(entry.timestamp), 'EEE');
        return entryDay === day;
      });

      const moodValues: Record<Mood, number> = {
        joyful: 5,
        happy: 4,
        content: 3.5,
        neutral: 2.5,
        sad: 1.5,
        anxious: 1,
        stressed: 1,
        angry: 0.5,
        exhausted: 1
      };

      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / dayEntries.length
        : 0;

      return {
        day,
        mood: avgMood,
        entries: dayEntries.length
      };
    });
  };

  const getMoodLabel = (mood: string) => {
    const labels = {
      en: {
        joyful: 'Joyful',
        happy: 'Happy',
        content: 'Content',
        neutral: 'Neutral',
        sad: 'Sad',
        anxious: 'Anxious',
        angry: 'Angry',
        exhausted: 'Exhausted',
        stressed: 'Stressed'
      },
      hi: {
        joyful: 'आनंदित',
        happy: 'खुश',
        content: 'संतुष्ट',
        neutral: 'तटस्थ',
        sad: 'उदास',
        anxious: 'चिंतित',
        angry: 'गुस्सा',
        exhausted: 'थका हुआ',
        stressed: 'तनावग्रस्त'
      }
    };
    return labels[language === 'en' ? 'en' : 'hi'][mood as Mood] || mood;
  };

  const getInsights = () => {
    if (!analytics || moodEntries.length === 0) return [];

    const insights = [];
    
    // Most frequent mood insight
    insights.push({
      icon: Award,
      title: language === 'en' ? 'Dominant Mood' : 'प्रमुख मूड',
      value: getMoodLabel(analytics.mostFrequentMood),
      description: language === 'en' 
        ? `Your most frequent mood this period` 
        : `इस अवधि में आपका सबसे आम मूड`
    });

    // Streak insight
    const recentEntries = moodEntries
      .filter(entry => isAfter(new Date(entry.timestamp), subDays(new Date(), 7)))
      .length;
    
    insights.push({
      icon: Target,
      title: language === 'en' ? 'Weekly Activity' : 'साप्ताहिक गतिविधि',
      value: `${recentEntries}/7`,
      description: language === 'en' 
        ? 'Days tracked this week' 
        : 'इस सप्ताह ट्रैक किए गए दिन'
    });

    // Average mood insight
    insights.push({
      icon: Brain,
      title: language === 'en' ? 'Mood Score' : 'मूड स्कोर',
      value: `${(analytics.averageMood * 20).toFixed(0)}%`,
      description: language === 'en' 
        ? 'Overall mood rating' 
        : 'समग्र मूड रेटिंग'
    });

    return insights;
  };

  const trendData = getMoodTrendData();
  const distributionData = getMoodDistribution();
  const weeklyData = getWeeklyPattern();
  const insights = getInsights();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold gradient-heading flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            {language === 'en' ? 'Mood Analytics' : 'मूड एनालिटिक्स'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Understand your emotional patterns and trends' 
              : 'अपने भावनात्मक पैटर्न और रुझानों को समझें'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('week')}
              className="rounded-none"
            >
              {language === 'en' ? 'Week' : 'सप्ताह'}
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('month')}
              className="rounded-none"
            >
              {language === 'en' ? 'Month' : 'महीना'}
            </Button>
          </div>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            {language === 'en' ? 'Refresh' : 'रीफ्रेश'}
          </Button>
        </div>
      </motion.div>

      {/* Insights Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {insights.map((insight, index) => (
          <Card key={index} className="glass-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center`}>
                  <insight.icon className="h-6 w-6 text-primary" />
                </div>
                <Sparkles className="h-5 w-5 text-primary/60" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                  {insight.title}
                </h3>
                <p className="text-2xl font-bold gradient-heading mb-1">
                  {insight.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {language === 'en' ? 'Mood Trend' : 'मूड ट्रेंड'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 5]} 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-primary">
                                {language === 'en' ? 'Mood Score' : 'मूड स्कोर'}: {payload[0]?.value ? (Number(payload[0].value) * 20).toFixed(0) : 0}%
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {language === 'en' ? 'Entries' : 'एंट्रीज़'}: {payload[0]?.payload?.entries || 0}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.2}
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                {language === 'en' ? 'Mood Distribution' : 'मूड वितरण'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {distributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        dataKey="value"
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">
                      {language === 'en' ? 'No data available' : 'कोई डेटा उपलब्ध नहीं'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Pattern */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {language === 'en' ? 'Weekly Pattern' : 'साप्ताहिक पैटर्न'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="day" 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 5]} 
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-primary">
                                {language === 'en' ? 'Avg Mood' : 'औसत मूड'}: {payload[0]?.value ? (Number(payload[0].value) * 20).toFixed(0) : 0}%
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {language === 'en' ? 'Entries' : 'एंट्रीज़'}: {payload[0]?.payload?.entries || 0}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="mood" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                {language === 'en' ? 'Insights & Tips' : 'अंतर्दृष्टि और सुझाव'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {moodEntries.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' 
                      ? 'Start tracking your mood to get personalized insights!' 
                      : 'व्यक्तिगत अंतर्दृष्टि पाने के लिए अपना मूड ट्रैक करना शुरू करें!'
                    }
                  </p>
                ) : (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                      <Heart className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {language === 'en' ? 'Consistency is key!' : 'निरंतरता मुख्य है!'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {language === 'en' 
                            ? 'Track daily for better insights into your emotional patterns.' 
                            : 'अपने भावनात्मक पैटर्न में बेहतर अंतर्दृष्टि के लिए रोज़ाना ट्रैक करें।'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                      <Clock className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {language === 'en' ? 'Reflect on patterns' : 'पैटर्न पर विचार करें'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {language === 'en' 
                            ? 'Notice what times or situations affect your mood most.' 
                            : 'ध्यान दें कि कौन से समय या स्थितियां आपके मूड को सबसे ज्यादा प्रभावित करती हैं।'
                          }
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MoodDashboard;