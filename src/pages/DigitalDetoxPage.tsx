
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Smartphone, Clock, Check, Heart, Instagram, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import ScreenTimeTracker from '@/components/ScreenTimeTracker';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel';

// Mock data for detox tips
const DETOX_TIPS = [
  {
    id: '1',
    title: 'Schedule Tech-Free Time',
    description: 'Set aside specific times during the day when you disconnect from all digital devices.',
    icon: Clock,
  },
  {
    id: '2',
    title: 'Turn Off Notifications',
    description: 'Disable non-essential notifications to reduce the constant urge to check your phone.',
    icon: Smartphone,
  },
  {
    id: '3',
    title: 'Create Phone-Free Zones',
    description: 'Designate areas in your home where phones and devices aren\'t allowed, like the dinner table or bedroom.',
    icon: Check,
  },
  {
    id: '4',
    title: 'Practice Mindful Scrolling',
    description: 'Before opening an app, pause and ask yourself why you\'re doing it and if it\'s necessary.',
    icon: Heart,
  },
];

// Mock data for social media anxiety tips
const SOCIAL_MEDIA_TIPS = [
  {
    id: '1',
    platform: 'Instagram',
    tip: 'Remember that Instagram posts are curated highlights, not reality. Unfollow accounts that make you feel inadequate.',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
  },
  {
    id: '2',
    platform: 'Twitter',
    tip: 'Use lists to curate your feed with positive content. Set time limits for how long you spend scrolling through tweets.',
    icon: Twitter,
    color: 'bg-gradient-to-r from-blue-400 to-blue-600',
  },
  {
    id: '3',
    platform: 'Facebook',
    tip: 'Adjust your news feed preferences to see more of what makes you happy. Consider taking regular breaks from checking Facebook.',
    icon: Facebook,
    color: 'bg-gradient-to-r from-blue-600 to-blue-800',
  },
];

// Journaling prompts
const JOURNAL_PROMPTS = [
  "How did I feel before and after using social media today?",
  "What content made me feel good today, and what content made me feel anxious or inadequate?",
  "What's one way I can improve my relationship with technology this week?",
  "If I couldn't use social media for a week, what would I miss most and why?",
  "When do I find myself mindlessly reaching for my phone, and what triggers this behavior?",
];

// Digital Wellbeing Tips for Carousel
const WELLBEING_TIPS = [
  {
    title: "Set App Limits",
    description: "Use your phone's built-in tools to set time limits for social media and entertainment apps.",
    icon: "⏱️"
  },
  {
    title: "Grayscale Mode",
    description: "Turn on grayscale mode to make your phone less visually appealing and reduce the dopamine hit.",
    icon: "📱"
  },
  {
    title: "Notification Batching",
    description: "Configure your notifications to arrive in batches at specific times rather than constantly.",
    icon: "🔔"
  },
  {
    title: "Digital Sunset",
    description: "Stop using screens 1-2 hours before bedtime to improve sleep quality.",
    icon: "🌙"
  },
  {
    title: "Phone-Free Meals",
    description: "Make mealtimes a phone-free zone to enjoy your food and company fully.",
    icon: "🍽️"
  },
  {
    title: "Mindful Mornings",
    description: "Wait 30 minutes after waking up before checking your phone.",
    icon: "🌅"
  }
];

const DigitalDetoxPage = () => {
  const { t } = useLanguage();
  const [activeChallenge, setActiveChallenge] = useState(false);
  const [journalEntry, setJournalEntry] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(JOURNAL_PROMPTS[0]);
  
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
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  const handleChallengeToggle = () => {
    setActiveChallenge(!activeChallenge);
  };
  
  const getNewPrompt = () => {
    const currentIndex = JOURNAL_PROMPTS.indexOf(currentPrompt);
    const nextIndex = (currentIndex + 1) % JOURNAL_PROMPTS.length;
    setCurrentPrompt(JOURNAL_PROMPTS[nextIndex]);
  };
  
  const saveJournalEntry = () => {
    if (journalEntry.trim()) {
      console.log('Saving journal entry:', journalEntry);
      // Here we would save the entry to a database
      setJournalEntry('');
      getNewPrompt();
    }
  };
  
  return (
    <motion.div 
      className="container mx-auto max-w-5xl px-4 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold gradient-heading mb-4">
          {t('nav.digitalDetox') || 'Digital Wellness & Social Media Anxiety Relief'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find balance in your digital life with our tools and tips designed to help you develop healthier relationships with technology.
        </p>
      </motion.div>
      
      {/* Digital Wellbeing Tips Carousel */}
      <motion.section
        variants={itemVariants}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Digital Wellbeing Tips</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {WELLBEING_TIPS.map((tip, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="glass-card-premium h-full flex flex-col">
                    <CardHeader>
                      <div className="text-3xl mb-2">{tip.icon}</div>
                      <CardTitle className="text-xl">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{tip.description}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-4">
            <CarouselPrevious className="relative static translate-y-0 left-0" />
            <CarouselNext className="relative static translate-y-0 right-0" />
          </div>
        </Carousel>
      </motion.section>
      
      {/* Daily Challenge Section */}
      <motion.section 
        variants={itemVariants}
        className="mb-16"
      >
        <Card className="overflow-hidden border-2 border-vyanamana-200 dark:border-vyanamana-800">
          <CardHeader className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-700 text-white">
            <CardTitle className="text-center">Daily Digital Detox Challenge</CardTitle>
            <CardDescription className="text-white/80 text-center">
              Take a simple step today toward digital wellness
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">2-Hour Phone-Free Evening</h3>
                <p className="text-muted-foreground mt-1">
                  Set aside 2 hours this evening to completely disconnect from all digital devices.
                </p>
              </div>
              <Switch
                checked={activeChallenge}
                onCheckedChange={handleChallengeToggle}
                className="data-[state=checked]:bg-vyanamana-600"
              />
            </div>
            
            {activeChallenge && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-4 bg-vyanamana-50 dark:bg-vyanamana-900/20 rounded-lg"
              >
                <h4 className="font-medium mb-2">Challenge Accepted! Tips:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Put your phone in another room</li>
                  <li>Let friends/family know you'll be offline</li>
                  <li>Prepare alternative activities (book, puzzle, walk)</li>
                  <li>Notice how you feel during and after the break</li>
                </ul>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.section>
      
      {/* Screen Time Tracking */}
      <motion.section 
        variants={itemVariants}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Screen Time Tracking</h2>
        <ScreenTimeTracker />
      </motion.section>
      
      {/* Tips Section */}
      <motion.section 
        variants={itemVariants}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Digital Wellness Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DETOX_TIPS.map((tip) => (
            <Card key={tip.id} className="glass-card">
              <CardHeader>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-vyanamana-100 dark:bg-vyanamana-800 flex items-center justify-center mr-3">
                    <tip.icon className="h-5 w-5 text-vyanamana-600 dark:text-vyanamana-400" />
                  </div>
                  <CardTitle className="text-xl">{tip.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
      
      {/* Social Media Anxiety Tips */}
      <motion.section 
        variants={itemVariants}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Social Media Anxiety Relief</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOCIAL_MEDIA_TIPS.map((item) => (
            <Card key={item.id} className="overflow-hidden glass-card">
              <div className={`h-2 ${item.color}`}></div>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color} text-white`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <CardTitle>{item.platform}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
      
      {/* Reflective Journaling */}
      <motion.section 
        variants={itemVariants}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Reflective Journaling</h2>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Today's Prompt</CardTitle>
            <CardDescription>
              Reflect on your relationship with technology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <p className="italic">{currentPrompt}</p>
            </div>
            <Textarea
              placeholder="Write your thoughts here..."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              className="min-h-[150px]"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={getNewPrompt}>
              New Prompt
            </Button>
            <Button 
              onClick={saveJournalEntry} 
              disabled={!journalEntry.trim()}
              className="bg-vyanamana-500 hover:bg-vyanamana-600"
            >
              Save Reflection
            </Button>
          </CardFooter>
        </Card>
      </motion.section>
      
      {/* Mood vs Screen Time Graph */}
      <motion.section 
        variants={itemVariants}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Mood vs Screen Time</h2>
        <Card className="glass-card p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="text-center p-6 border border-dashed border-muted-foreground rounded-lg w-full">
              <Smartphone className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Mood vs screen time correlation graph would appear here</p>
              <p className="text-sm text-muted-foreground mt-2">Track your mood and screen time regularly to see trends</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Card className="p-4 bg-muted/50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Average Mood</p>
                  <p className="text-xl font-semibold">Positive</p>
                </div>
                <div className="text-2xl">😊</div>
              </div>
            </Card>
            <Card className="p-4 bg-muted/50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">When Screen Time Below 3h</p>
                  <p className="text-xl font-semibold">Very Positive</p>
                </div>
                <div className="text-2xl">😄</div>
              </div>
            </Card>
          </div>
        </Card>
      </motion.section>
    </motion.div>
  );
};

export default DigitalDetoxPage;
