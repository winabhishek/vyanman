
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Volume2, VolumeX, Clock, Music, Heart } from 'lucide-react';
import ThreeBreathingAnimation from '@/components/ThreeBreathingAnimation';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel';
import { useMeditationAudioAPI, MeditationSound } from '@/services/meditationAPI';
import MeditationPlayer from '@/components/meditation/MeditationPlayer';

// Meditation categories
const CATEGORIES = ["All", "Beginner", "Intermediate", "Advanced", "Sleep", "Anxiety", "Focus"];

// Mock meditation data
const GUIDED_MEDITATIONS = [
  {
    id: '1',
    title: 'Mindful Breathing',
    description: 'A simple practice to calm your mind and body through breath awareness.',
    duration: '5 min',
    category: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '2',
    title: 'Body Scan Relaxation',
    description: 'Progressively relaxing each part of your body to release tension.',
    duration: '10 min',
    category: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJlbGF4YXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '3',
    title: 'Loving-Kindness',
    description: 'Cultivate compassion and love for yourself and others through guided imagery.',
    duration: '7 min',
    category: 'intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1536623975707-c4b75156ac0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGxvdmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '4',
    title: 'Stress Relief',
    description: 'Quick practice to help you find calm during stressful moments.',
    duration: '3 min',
    category: 'beginner',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3RyZXNzJTIwcmVsaWVmfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '5',
    title: 'Deep Focus',
    description: 'Enhance concentration and mental clarity with this guided practice.',
    duration: '10 min',
    category: 'advanced',
    imageUrl: 'https://images.unsplash.com/photo-1529651737248-dad5e287768e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9jdXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
  },
];

const MeditationPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('guided');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMeditation, setCurrentMeditation] = useState<(typeof GUIDED_MEDITATIONS)[0] | null>(null);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedSound, setSelectedSound] = useState('piano');
  const [breathingCount, setBreathingCount] = useState(4); // 4-second breathing rhythm
  
  // Use our new audio API
  const { 
    getMeditationSounds, 
    playSound, 
    stopSound, 
    setVolume: setAudioVolume, 
    currentlyPlaying,
    isLoading 
  } = useMeditationAudioAPI();
  
  const [sounds, setSounds] = useState<MeditationSound[]>([]);
  const [selectedMeditationSound, setSelectedMeditationSound] = useState<MeditationSound | null>(null);

  // Load meditation sounds
  useEffect(() => {
    const loadSounds = async () => {
      const fetchedSounds = await getMeditationSounds();
      setSounds(fetchedSounds);
    };
    
    loadSounds();
  }, []);

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

  const handleMeditationSelect = (meditation: typeof GUIDED_MEDITATIONS[0]) => {
    setCurrentMeditation(meditation);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setAudioVolume(isMuted ? volume : 0);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    setAudioVolume(newVolume[0]);
    if (isMuted && newVolume[0] > 0) {
      setIsMuted(false);
    }
  };

  const handleSoundSelect = (soundId: string) => {
    const sound = sounds.find(s => s.id === soundId);
    
    if (sound) {
      setSelectedSound(soundId);
      playSound(soundId);
      setSelectedMeditationSound(sound);
    }
  };
  
  const closeMeditationPlayer = () => {
    stopSound();
    setSelectedMeditationSound(null);
  };

  return (
    <motion.div 
      className="container mx-auto max-w-5xl px-4 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Logo */}
      <motion.div variants={itemVariants} className="mb-8 flex justify-center">
        <img 
          src="public/lovable-uploads/c59470ba-513c-4590-8a16-6896ef9b3ffe.png" 
          alt="Vyanman Logo" 
          className="w-16 h-16 md:w-24 md:h-24"
        />
      </motion.div>
      
      <motion.div variants={itemVariants} className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold gradient-heading mb-4">
          {t('nav.meditation') || 'Meditation & Mindfulness'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Cultivate inner peace and mindfulness with guided practices and breathing exercises
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mb-16"
      >
        <Tabs defaultValue="guided" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8 bg-amber-900/20 border border-amber-500/30">
            <TabsTrigger value="guided" className="data-[state=active]:bg-amber-500 data-[state=active]:text-amber-950">Guided Meditations</TabsTrigger>
            <TabsTrigger value="breathing" className="data-[state=active]:bg-amber-500 data-[state=active]:text-amber-950">Breathing Exercise</TabsTrigger>
          </TabsList>

          <TabsContent value="guided" className="space-y-8">
            {/* Meditation Categories Carousel */}
            <Carousel className="mb-8">
              <CarouselContent>
                {CATEGORIES.map((category) => (
                  <CarouselItem key={category} className="md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <Card className="glass-card-premium cursor-pointer hover:shadow-lg transition-all duration-300">
                        <CardContent className="flex items-center justify-center p-6">
                          <p className="text-center font-medium">{category}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4">
                <CarouselPrevious className="relative static translate-y-0 left-0" />
                <CarouselNext className="relative static translate-y-0 right-0" />
              </div>
            </Carousel>

            {/* Meditation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GUIDED_MEDITATIONS.map((meditation) => (
                <motion.div
                  key={meditation.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="overflow-hidden h-full glass-card-premium cursor-pointer"
                    onClick={() => handleMeditationSelect(meditation)}
                  >
                    <div className="relative h-40 w-full overflow-hidden">
                      <img 
                        src={meditation.imageUrl} 
                        alt={meditation.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute bottom-0 right-0 bg-black/50 px-3 py-1 rounded-tl-lg">
                        <div className="flex items-center gap-1 text-white">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{meditation.duration}</span>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{meditation.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{meditation.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full gap-2 border-amber-500/50 hover:bg-amber-500/20">
                        <Play className="h-4 w-4" />
                        Start Meditation
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="breathing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass-card-premium p-6">
                <CardHeader>
                  <CardTitle>Guided Breathing</CardTitle>
                  <CardDescription>
                    Follow the animation and let your breath flow naturally
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Breathing Pace</span>
                    <span className="font-medium">{breathingCount} seconds</span>
                  </div>
                  <Slider
                    value={[breathingCount]}
                    min={2}
                    max={8}
                    step={1}
                    onValueChange={(value) => setBreathingCount(value[0])}
                    className="[&>span]:bg-amber-500"
                  />
                  <div className="flex flex-col space-y-1 mt-4">
                    <span className="text-sm text-muted-foreground">Instructions:</span>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Inhale deeply through your nose for {breathingCount} seconds</li>
                      <li>Hold your breath for {breathingCount} seconds</li>
                      <li>Exhale slowly through mouth for {breathingCount} seconds</li>
                      <li>Repeat for 5-10 minutes for best results</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2 premium-button">
                    <Heart className="h-4 w-4" />
                    Begin Breathing Exercise
                  </Button>
                </CardFooter>
              </Card>

              <div className="flex flex-col space-y-4">
                <ThreeBreathingAnimation />
                <Card className="glass-card-premium">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Background Sounds</CardTitle>
                    <CardDescription>
                      Enhance your experience with calming sounds
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                      {!isLoading && sounds.map((sound) => (
                        <Button
                          key={sound.id}
                          variant={selectedSound === sound.id ? "default" : "outline"}
                          className={selectedSound === sound.id ? "bg-amber-500 text-amber-950" : "border-amber-500/30"}
                          onClick={() => handleSoundSelect(sound.id)}
                        >
                          <span className="mr-2">{sound.icon}</span>
                          {sound.name}
                        </Button>
                      ))}
                      {isLoading && (
                        <div className="col-span-3 py-8 text-center">
                          <p>Loading sounds...</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={toggleMute}
                        className="shrink-0 border-amber-500/30"
                      >
                        {isMuted ? <VolumeX /> : <Volume2 />}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        disabled={isMuted}
                        className="flex-1 [&>span]:bg-amber-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Meditation Player */}
      {selectedMeditationSound && (
        <MeditationPlayer 
          sound={selectedMeditationSound} 
          onClose={closeMeditationPlayer} 
        />
      )}

      {/* Meditation Player (shows when a guided meditation is selected) */}
      {currentMeditation && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-amber-800/90 to-orange-700/90 backdrop-blur-md shadow-lg border-t border-amber-500/20 p-4 z-50"
        >
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 rounded-full bg-amber-500 text-white hover:bg-amber-600"
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
                <div>
                  <h3 className="font-semibold text-white">{currentMeditation.title}</h3>
                  <p className="text-sm text-amber-200">{currentMeditation.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" onClick={toggleMute} className="text-amber-100 hover:text-white">
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-24 md:w-32 [&>span]:bg-amber-500"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-amber-100 hover:text-white"
                  onClick={() => setCurrentMeditation(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MeditationPage;
