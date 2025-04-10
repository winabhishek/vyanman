
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Play, Pause, Clock, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ThreeBreathingAnimation from '@/components/ThreeBreathingAnimation';
import { Slider } from '@/components/ui/slider';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext 
} from '@/components/ui/carousel';

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
  {
    id: '4',
    title: 'Mindful Walking',
    description: 'Connect with your body through mindful movement',
    duration: 12,
    category: 'advanced',
    thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '5',
    title: 'Sleep Meditation',
    description: 'Gentle guidance to help you drift into restful sleep',
    duration: 15,
    category: 'beginner',
    thumbnail: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  },
];

// Background sounds for meditation
const BACKGROUND_SOUNDS = [
  { id: 'nature', name: 'Nature Sounds', icon: '🌳' },
  { id: 'rain', name: 'Gentle Rain', icon: '🌧️' },
  { id: 'waves', name: 'Ocean Waves', icon: '🌊' },
  { id: 'white-noise', name: 'White Noise', icon: '🌫️' },
  { id: 'none', name: 'No Sound', icon: '🔇' },
];

const MeditationPage = () => {
  const { t } = useLanguage();
  const [activeMeditation, setActiveMeditation] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes in seconds
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedSound, setSelectedSound] = useState(BACKGROUND_SOUNDS[0].id);
  
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
  
  const startMeditation = (id: string) => {
    const meditation = MEDITATIONS.find(m => m.id === id);
    if (meditation) {
      setActiveMeditation(id);
      setDuration(meditation.duration * 60);
      setCurrentTime(0);
      setIsPlaying(true);
      // This would integrate with actual audio player
      console.log(`Starting meditation with ID: ${id}`);
    }
  };
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
      
      {/* 3D Breathing Animation */}
      <motion.section
        variants={itemVariants}
        className="mb-16 relative"
      >
        <div className="absolute inset-0 bg-gradient-radial from-lavender/20 to-transparent -z-10 rounded-3xl blur-3xl"></div>
        <h2 className="text-2xl font-bold mb-6 text-center">Breathing Exercise</h2>
        <ThreeBreathingAnimation />
      </motion.section>
      
      {/* Featured Meditations Carousel */}
      <motion.section
        variants={itemVariants}
        className="mb-16"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Meditations</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {MEDITATIONS.map((meditation) => (
              <CarouselItem key={meditation.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 glass-card h-full">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </motion.section>
      
      {/* Meditation Player */}
      {activeMeditation && (
        <motion.section
          variants={itemVariants}
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card overflow-hidden border border-vyanamana-200 dark:border-vyanamana-800">
            <CardHeader className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-700 text-white">
              <CardTitle>
                {MEDITATIONS.find(m => m.id === activeMeditation)?.title || "Meditation"}
              </CardTitle>
              <CardDescription className="text-white/80">
                {MEDITATIONS.find(m => m.id === activeMeditation)?.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-semibold inline-block text-vyanamana-600">
                        {formatTime(currentTime)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-vyanamana-600">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 flex rounded bg-vyanamana-200 dark:bg-vyanamana-900">
                    <motion.div 
                      className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-600" 
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                      animate={{ width: `${(currentTime / duration) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex justify-center items-center space-x-6 mb-8">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={toggleMute}
                  className="hover:text-vyanamana-500"
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </Button>
                
                <Button 
                  size="icon" 
                  className="h-14 w-14 rounded-full bg-vyanamana-500 hover:bg-vyanamana-600 text-white shadow-lg"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>
                
                <div className="w-24">
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    className={isMuted ? "opacity-50" : ""}
                    onValueChange={(vals) => setVolume(vals[0])}
                  />
                </div>
              </div>
              
              {/* Background Sounds */}
              <div>
                <h4 className="text-sm font-medium mb-3">Background Sound</h4>
                <div className="flex flex-wrap gap-2">
                  {BACKGROUND_SOUNDS.map(sound => (
                    <Button 
                      key={sound.id}
                      variant={selectedSound === sound.id ? "default" : "outline"}
                      size="sm"
                      className={selectedSound === sound.id 
                        ? "bg-vyanamana-500 hover:bg-vyanamana-600" 
                        : "hover:border-vyanamana-300"
                      }
                      onClick={() => setSelectedSound(sound.id)}
                    >
                      <span className="mr-2">{sound.icon}</span>
                      {sound.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}
      
      {/* Benefits Section */}
      <motion.section 
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
      </motion.section>
    </motion.div>
  );
};

export default MeditationPage;
