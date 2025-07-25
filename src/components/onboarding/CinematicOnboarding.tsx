
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

const CinematicOnboarding: React.FC = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const navigate = useNavigate();

  const scenes = [
    {
      id: 0,
      duration: 3000,
      text: "Initiating Vyanman protocol...",
      typeSpeed: 80
    },
    {
      id: 1,
      duration: 3000,
      text: "Tuning into your emotional frequencies...",
      typeSpeed: 60
    },
    {
      id: 2,
      duration: 3000,
      text: "Welcome. I'm Vyanman — your personal mental health companion.",
      typeSpeed: 50
    },
    {
      id: 3,
      duration: 6000,
      text: null // Final hero scene
    }
  ];

  // Typewriter effect
  useEffect(() => {
    if (currentScene < 3 && scenes[currentScene].text) {
      const text = scenes[currentScene].text;
      const speed = scenes[currentScene].typeSpeed;
      let currentIndex = 0;
      
      setTypedText('');
      
      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setTypedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }
  }, [currentScene]);

  // Scene transitions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(currentScene + 1);
      } else if (currentScene === 3) {
        // Show CTA after final scene
        setTimeout(() => setShowCTA(true), 2000);
      }
    }, scenes[currentScene].duration);

    return () => clearTimeout(timer);
  }, [currentScene]);

  const handleBeginJourney = () => {
    navigate('/chat');
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  // Particle animation variants
  const particleVariants = {
    float: {
      y: [0, -20, 0],
      opacity: [0.3, 0.8, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // AI Orb animation
  const orbVariants = {
    breathe: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Audio Toggle */}
      <motion.button
        onClick={toggleAudio}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </motion.button>

      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-400/20"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={particleVariants}
            animate="float"
            transition={{
              delay: Math.random() * 2,
              duration: Math.random() * 3 + 3
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Scene 0: Black Screen with Typewriter */}
        {currentScene === 0 && (
          <motion.div
            key="scene0"
            className="absolute inset-0 bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <motion.p
                className="text-xl md:text-2xl text-cyan-300 font-light tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {typedText}
                <motion.span
                  className="inline-block w-0.5 h-6 bg-cyan-300 ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Scene 1: Aurora Gradient */}
        {currentScene === 1 && (
          <motion.div
            key="scene1"
            className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/10 to-transparent animate-pulse" />
            <div className="flex items-center justify-center h-full">
              <motion.p
                className="text-xl md:text-2xl text-white font-light tracking-wide text-center max-w-2xl px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                {typedText}
                <motion.span
                  className="inline-block w-0.5 h-6 bg-white ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Scene 2: AI Orb Scene */}
        {currentScene === 2 && (
          <motion.div
            key="scene2"
            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="flex flex-col items-center justify-center h-full px-6">
              {/* AI Orb */}
              <motion.div
                className="relative mb-12"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, type: "spring" }}
              >
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-2xl relative overflow-hidden"
                  variants={orbVariants}
                  animate="breathe"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                </motion.div>
                
                {/* Orb Glow */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl scale-150"
                  animate={{
                    scale: [1.2, 1.5, 1.2],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              {/* Text */}
              <motion.p
                className="text-xl md:text-2xl text-white font-light tracking-wide text-center max-w-3xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
              >
                {typedText}
                <motion.span
                  className="inline-block w-0.5 h-6 bg-white ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.p>

              <motion.p
                className="text-lg text-cyan-200 font-light mt-6 text-center italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                "Vyanman learns from you — with empathy and care."
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Scene 3: Final Hero */}
        {currentScene === 3 && (
          <motion.div
            key="scene3"
            className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <div className="flex flex-col items-center justify-center h-full px-6 relative">
              {/* Glassmorphism Panel */}
              <motion.div
                className="relative max-w-4xl mx-auto text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl" />
                
                <div className="relative p-12 md:p-16">
                  {/* Logo Area */}
                  <motion.div
                    className="mb-8"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-4">
                      <img 
                        src="/lovable-uploads/1bc785b7-5504-4cf1-a065-d957430f5da4.png" 
                        alt="Vyanman Logo" 
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>
                  </motion.div>

                  {/* Main Headline */}
                  <motion.h1
                    className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    Empowering emotional well-being,
                    <span className="block text-cyan-300">through AI.</span>
                  </motion.h1>

                  {/* Subtext */}
                  <motion.p
                    className="text-xl md:text-2xl text-slate-300 font-light mb-8 max-w-2xl mx-auto leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                  >
                    Listen. Understand. Support. 
                    <span className="block text-cyan-200 mt-2">Vyanman is here for you.</span>
                  </motion.p>

                  {/* CTA Button */}
                  <AnimatePresence>
                    {showCTA && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                      >
                        <Button
                          onClick={handleBeginJourney}
                          size="lg"
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-4 text-lg rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 group"
                        >
                          Begin Your Journey
                          <motion.span
                            className="ml-2 inline-block"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Ambient Elements */}
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 1 }}
              >
                <p className="text-sm text-slate-400 italic">
                  Your Mind, Our Mission
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CinematicOnboarding;
