
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, Pause, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for meditations
const MEDITATIONS = [
  {
    id: '1',
    title: 'Breath Awareness',
    description: 'A simple meditation focusing on your breath to calm the mind',
    duration: 5, // Minutes
    category: 'beginner',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '2',
    title: 'Body Scan',
    description: 'Progressive relaxation through focusing on different body parts',
    duration: 10,
    category: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '3',
    title: 'Loving-Kindness',
    description: 'Cultivate compassion and positive feelings for yourself and others',
    duration: 7,
    category: 'intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1516914589923-f105f1539f8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lZGl0YXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
  },
];

const MeditationPage = () => {
  const { t } = useLanguage();
  
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
  
  // Placeholder for the actual meditation player functionality
  const startMeditation = (id: string) => {
    console.log(`Starting meditation with ID: ${id}`);
    // This would integrate with actual audio/video player 
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
          {t('nav.meditation') || 'Mindful Meditation'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Take a moment to breathe, reflect, and rejuvenate with our guided meditations designed to help you find peace in your daily life.
        </p>
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {MEDITATIONS.map((meditation) => (
          <Card key={meditation.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 glass-card">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={meditation.thumbnail} 
                alt={meditation.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-2 right-2 bg-background/70 backdrop-blur-sm rounded-full px-2 py-1 text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{meditation.duration} min</span>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle>{meditation.title}</CardTitle>
              <CardDescription>{meditation.category}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm">{meditation.description}</p>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={() => startMeditation(meditation.id)}
                className="w-full bg-vyanamana-500 hover:bg-vyanamana-600"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Meditation
              </Button>
            </CardFooter>
          </Card>
        ))}
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="mt-16 text-center p-8 rounded-xl glass-card"
      >
        <h2 className="text-2xl font-semibold mb-4">Benefits of Regular Meditation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-vyanamana-100 dark:bg-vyanamana-900/30 flex items-center justify-center mb-4">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vyanamana-500"><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/><path d="M12 7v5l3 3"/></svg>
              </motion.div>
            </div>
            <h3 className="font-semibold mb-2">Reduced Stress</h3>
            <p className="text-sm text-muted-foreground">Lower stress hormones and reduce overall anxiety levels</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-vyanamana-100 dark:bg-vyanamana-900/30 flex items-center justify-center mb-4">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vyanamana-500"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4 -2 4 -2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              </motion.div>
            </div>
            <h3 className="font-semibold mb-2">Improved Mood</h3>
            <p className="text-sm text-muted-foreground">Increase positive emotions and overall life satisfaction</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-vyanamana-100 dark:bg-vyanamana-900/30 flex items-center justify-center mb-4">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vyanamana-500"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </motion.div>
            </div>
            <h3 className="font-semibold mb-2">Better Focus</h3>
            <p className="text-sm text-muted-foreground">Sharpen concentration and enhance attention span</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MeditationPage;
