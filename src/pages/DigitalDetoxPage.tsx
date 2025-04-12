
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Leaf, Cloud, Sun, Moon, Check, Bird, Timer, Trophy, Calendar } from 'lucide-react';

// Floating nature icons animation
const NatureElements = () => {
  const elements = [
    { icon: <Leaf className="text-green-400 h-5 w-5" />, delay: 0 },
    { icon: <Cloud className="text-blue-300 h-6 w-6" />, delay: 1.2 },
    { icon: <Sun className="text-yellow-300 h-5 w-5" />, delay: 0.5 },
    { icon: <Bird className="text-cyan-300 h-4 w-4" />, delay: 0.8 },
    { icon: <Moon className="text-indigo-200 h-4 w-4" />, delay: 1.5 },
    { icon: <Leaf className="text-emerald-300 h-3 w-3" />, delay: 2 },
    { icon: <Cloud className="text-violet-200 h-5 w-5" />, delay: 0.3 },
  ];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((element, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0 
          }}
          animate={{ 
            x: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50
            ],
            y: [
              Math.random() * 100,
              Math.random() * 100 - 200,
              Math.random() * 100 - 100,
              Math.random() * 100
            ],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 20 + Math.random() * 10,
            times: [0, 0.3, 0.7, 1],
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut"
          }}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  );
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
};

const DigitalDetoxPage = () => {
  const [activeTab, setActiveTab] = useState('timer');
  const [timerDuration, setTimerDuration] = useState(25 * 60); // 25 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [isActive, setIsActive] = useState(false);
  const [goalDays, setGoalDays] = useState(7);
  const [currentStreak, setCurrentStreak] = useState(0);
  
  // Reset timer when duration changes
  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(timerDuration);
    }
  }, [timerDuration, isActive]);
  
  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      setIsActive(false);
      // Here you could trigger a notification
      setCurrentStreak(prev => prev + 1);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);
  
  const toggleTimer = () => {
    if (timeRemaining === 0) {
      setTimeRemaining(timerDuration);
    }
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeRemaining(timerDuration);
  };
  
  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0] * 60; // Convert minutes to seconds
    setTimerDuration(newDuration);
    if (!isActive) {
      setTimeRemaining(newDuration);
    }
  };
  
  const handleGoalChange = (value: number[]) => {
    setGoalDays(value[0]);
  };
  
  const progressPercentage = (currentStreak / goalDays) * 100;
  
  return (
    <div className="relative py-12 min-h-[80vh]">
      <NatureElements />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold gradient-heading mb-3">
            Digital Detox
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Take time away from screens and reconnect with yourself
          </p>
        </motion.div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="timer">Focus Timer</TabsTrigger>
            <TabsTrigger value="goals">Detox Goals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Mindful Break Timer</CardTitle>
                  <CardDescription>
                    Set a timer for your digital detox period
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ scale: isActive ? [1, 1.03, 1] : 1 }}
                      transition={{ 
                        repeat: isActive ? Infinity : 0, 
                        duration: 4,
                        ease: "easeInOut" 
                      }}
                      className="text-5xl md:text-6xl font-mono font-bold gradient-heading"
                    >
                      {formatTime(timeRemaining)}
                    </motion.div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Timer Duration: {Math.floor(timerDuration / 60)} minutes
                    </label>
                    <Slider
                      value={[timerDuration / 60]}
                      min={5}
                      max={60}
                      step={5}
                      onValueChange={handleDurationChange}
                      disabled={isActive}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3 justify-center">
                  <Button 
                    onClick={toggleTimer}
                    className="w-32"
                    variant={isActive ? "outline" : "default"}
                  >
                    {isActive ? "Pause" : timeRemaining === 0 ? "Restart" : "Start"}
                  </Button>
                  <Button 
                    onClick={resetTimer} 
                    variant="outline"
                    disabled={!isActive && timeRemaining === timerDuration}
                  >
                    Reset
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Mindfulness Tips</CardTitle>
                  <CardDescription>
                    Activities to engage with during your digital detox
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      "Take deep breaths and focus on your breathing",
                      "Look around and identify 5 things you can see",
                      "Write in a journal about your thoughts",
                      "Stretch your body or do light exercise",
                      "Drink a glass of water mindfully"
                    ].map((tip, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.5 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1 text-vyanamana-500">
                          <Check size={16} />
                        </div>
                        <p>{tip}</p>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="goals">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Detox Challenge</CardTitle>
                  <CardDescription>
                    Track your progress towards your digital detox goal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Goal: {goalDays} days</span>
                      <span>Current streak: {currentStreak} days</span>
                    </div>
                    <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-vyanamana-400 to-vyanamana-600 rounded-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Set Your Goal (days)
                    </label>
                    <Slider
                      value={[goalDays]}
                      min={1}
                      max={30}
                      step={1}
                      onValueChange={handleGoalChange}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full gap-2">
                      <Trophy size={16} />
                      Complete Today's Detox
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Schedule Your Detox</CardTitle>
                  <CardDescription>
                    Plan regular digital detox sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Daily Reminder Time
                    </label>
                    <Input type="time" defaultValue="18:00" />
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex flex-wrap gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className="flex-1 min-w-[40px]"
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full gap-2">
                      <Calendar size={16} />
                      Save Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="text-center mt-12 max-w-md mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-muted-foreground italic"
          >
            "The richness of life doesn't come from devices, but from the moments in between."
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default DigitalDetoxPage;
