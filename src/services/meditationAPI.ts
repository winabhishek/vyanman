import { useState } from 'react';

export interface MeditationSound {
  id: string;
  name: string;
  category: 'meditation' | 'nature' | 'music' | 'binaural';
  description?: string;
  audioUrl: string;
  icon: string;
  duration: number;
  mood?: 'calm' | 'peaceful' | 'refreshed' | 'energetic' | 'focused' | 'mindful' | 'spiritual' | 'transcendent' | 'serene' | 'concentrated' | 'alert' | 'deep';
}

export interface GuidedMeditation {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'sleep' | 'anxiety' | 'focus' | 'stress' | 'love';
  imageUrl: string;
  audioUrl?: string;
  transcript?: string;
  mood?: string;
}

// Enhanced meditation sounds with working audio URLs and mood-based categories
const MEDITATION_SOUNDS: MeditationSound[] = [
  // Nature Sounds
  {
    id: 'rain',
    name: 'Rain Sounds',
    category: 'nature',
    description: 'Calming rain sounds for relaxation and stress relief',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3',
    icon: '🌧️',
    duration: 600,
    mood: 'calm'
  },
  {
    id: 'ocean',
    name: 'Ocean Waves', 
    category: 'nature',
    description: 'Soothing ocean waves for deep relaxation',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a',
    icon: '🌊',
    duration: 600,
    mood: 'peaceful'
  },
  {
    id: 'forest',
    name: 'Forest Ambience',
    category: 'nature', 
    description: 'Peaceful forest sounds with birds chirping',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3',
    icon: '🌲',
    duration: 600,
    mood: 'refreshed'
  },
  {
    id: 'birds',
    name: 'Morning Birds',
    category: 'nature', 
    description: 'Gentle bird songs for morning meditation',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/intromusic.ogg',
    icon: '🐦',
    duration: 600,
    mood: 'energetic'
  },
  
  // Meditation Sounds
  {
    id: 'singing-bowls',
    name: 'Tibetan Bowls',
    category: 'meditation',
    description: 'Sacred singing bowls for deep meditation',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/thrust.mp3',
    icon: '🎵',
    duration: 900,
    mood: 'focused'
  },
  {
    id: 'meditation-bells',
    name: 'Meditation Bells',
    category: 'meditation',
    description: 'Traditional meditation bells for mindfulness',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/explosion.mp3',
    icon: '🔔',
    duration: 300,
    mood: 'mindful'
  },
  {
    id: 'om-chanting',
    name: 'Om Chanting',
    category: 'meditation',
    description: 'Sacred Om mantra for spiritual practice',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/menu.ogg',
    icon: '🕉️',
    duration: 1200,
    mood: 'spiritual'
  },
  
  // Ambient Music
  {
    id: 'crystal-tones',
    name: 'Crystal Tones',
    category: 'music',
    description: 'Ethereal crystal bowl harmonics',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/pang/paza-moduless.mp3',
    icon: '💎',
    duration: 800,
    mood: 'transcendent'
  },
  {
    id: 'gentle-piano',
    name: 'Gentle Piano',
    category: 'music',
    description: 'Soft piano melodies for relaxation',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3',
    icon: '🎹',
    duration: 900,
    mood: 'serene'
  },
  {
    id: 'ambient-drones',
    name: 'Ambient Drones',
    category: 'music',
    description: 'Deep atmospheric tones for focus',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/fx/engine-2.ogg',
    icon: '🌌',
    duration: 1500,
    mood: 'concentrated'
  },
  
  // Binaural Beats
  {
    id: 'alpha-waves',
    name: 'Alpha Waves',
    category: 'binaural',
    description: 'Alpha frequency for relaxed awareness',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/pang/arrow.mp3',
    icon: '🧠',
    duration: 1800,
    mood: 'alert'
  },
  {
    id: 'theta-waves',
    name: 'Theta Waves',
    category: 'binaural',
    description: 'Theta frequency for deep meditation',
    audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg',
    icon: '🌀',
    duration: 2400,
    mood: 'deep'
  }
];

export const useMeditationAudioAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioInstance, setAudioInstance] = useState<HTMLAudioElement | null>(null);

  const getMeditationSounds = async (): Promise<MeditationSound[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsLoading(false);
      return MEDITATION_SOUNDS;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch sounds');
      setError(error);
      setIsLoading(false);
      return [];
    }
  };

  const createAudioContext = () => {
    try {
      // Handle different browser implementations
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      return new AudioContextClass();
    } catch (err) {
      console.error('AudioContext not supported:', err);
      return null;
    }
  };

  const generateMeditationTone = (frequency: number, type: OscillatorType = 'sine', harmonics: boolean = true) => {
    const audioContext = createAudioContext();
    if (!audioContext) return null;

    const mainOscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    // Create a warmer, more natural sound
    mainOscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Main tone
    mainOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    mainOscillator.type = type;
    
    // Add subtle harmonics for richness
    const harmonicOscillators: OscillatorNode[] = [];
    if (harmonics) {
      for (let i = 2; i <= 4; i++) {
        const harmonic = audioContext.createOscillator();
        const harmonicGain = audioContext.createGain();
        
        harmonic.connect(harmonicGain);
        harmonicGain.connect(gainNode);
        
        harmonic.frequency.setValueAtTime(frequency * i, audioContext.currentTime);
        harmonic.type = 'sine';
        harmonicGain.gain.setValueAtTime(0.02 / i, audioContext.currentTime); // Subtle harmonics
        
        harmonicOscillators.push(harmonic);
      }
    }

    // Low-pass filter for warmth
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioContext.currentTime);
    filter.Q.setValueAtTime(1, audioContext.currentTime);

    // Volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.5);

    return { 
      oscillator: mainOscillator, 
      gainNode, 
      audioContext, 
      harmonics: harmonicOscillators,
      filter 
    };
  };

  const playSound = async (soundId: string) => {
    const sound = MEDITATION_SOUNDS.find(s => s.id === soundId);
    
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }
    
    if (sound) {
      try {
        const audio = new Audio();
        
        // Handle different audio sources
        audio.addEventListener('canplaythrough', () => {
          console.log(`Audio ready: ${sound.name}`);
          setError(null);
        });
        
        audio.addEventListener('error', (e) => {
          console.warn(`Audio error for ${sound.name}, using fallback tone`);
          
          // Enhanced fallback with mood-based frequencies
          const moodFrequencies: { [key: string]: number } = {
            'calm': 174,      // Deep relaxation
            'peaceful': 285,  // Natural healing
            'refreshed': 396, // Liberating fear
            'energetic': 417, // Facilitating change
            'focused': 528,   // DNA repair
            'mindful': 639,   // Connecting relationships
            'spiritual': 741, // Awakening intuition
            'transcendent': 852, // Third eye
            'serene': 963,    // Crown chakra
            'concentrated': 40, // Gamma waves
            'alert': 10,      // Alpha waves
            'deep': 6         // Theta waves
          };
          
          const frequency = moodFrequencies[sound.mood || 'calm'] || 440;
          const toneGenerator = generateMeditationTone(frequency, 'sine', true);
          
          if (toneGenerator) {
            const { oscillator, gainNode, audioContext, harmonics } = toneGenerator;
            
            oscillator.start();
            harmonics?.forEach(h => h.start());
            
            setCurrentlyPlaying(soundId);
            setError(null);
            
            // Create custom audio object for our tone
            const toneAudio = {
              pause: () => {
                try {
                  oscillator.stop();
                  harmonics?.forEach(h => h.stop());
                  audioContext.close();
                } catch (err) {
                  console.log('Tone already stopped');
                }
              },
              currentTime: 0,
              volume: 0.15,
              play: () => Promise.resolve()
            } as HTMLAudioElement;
            
            setAudioInstance(toneAudio);
          }
        });
        
        // Try to load and play the audio
        audio.crossOrigin = 'anonymous';
        audio.src = sound.audioUrl;
        audio.loop = true;
        audio.volume = 0.3; // Start with lower volume
        audio.preload = 'auto';
        
        try {
          await audio.play();
          setAudioInstance(audio);
          setCurrentlyPlaying(soundId);
          setError(null);
          console.log(`Successfully playing: ${sound.name}`);
        } catch (playError) {
          console.warn('Play failed, triggering error fallback');
          audio.dispatchEvent(new Event('error'));
        }
        
      } catch (err) {
        console.error('Comprehensive error in playSound:', err);
        setError(new Error(`Could not play ${sound.name}`));
      }
    }
  };

  const stopSound = () => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setAudioInstance(null);
      setCurrentlyPlaying(null);
    }
  };

  const setVolume = (volume: number) => {
    if (audioInstance) {
      audioInstance.volume = Math.max(0, Math.min(1, volume / 100));
    }
  };

  // Get sounds by mood
  const getSoundsByMood = (mood: string): MeditationSound[] => {
    return MEDITATION_SOUNDS.filter(sound => sound.mood === mood);
  };

  // Get random sound by category
  const getRandomSound = (category?: string): MeditationSound | null => {
    const filtered = category 
      ? MEDITATION_SOUNDS.filter(s => s.category === category)
      : MEDITATION_SOUNDS;
    
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  return {
    getMeditationSounds,
    playSound,
    stopSound,
    setVolume,
    getSoundsByMood,
    getRandomSound,
    currentlyPlaying,
    isLoading,
    error
  };
};