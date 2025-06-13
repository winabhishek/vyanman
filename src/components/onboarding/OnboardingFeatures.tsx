
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Heart, Brain, Calendar } from 'lucide-react';

interface OnboardingFeaturesProps {
  onNext: () => void;
  onPrevious: () => void;
}

const OnboardingFeatures: React.FC<OnboardingFeaturesProps> = ({ onNext, onPrevious }) => {
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'AI Chat Companion',
      description: 'Talk to our empathetic AI anytime you need support or guidance.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Mood Tracking',
      description: 'Monitor your emotional patterns and discover insights about your mental health.',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Mindfulness & Meditation',
      description: 'Access guided meditations and breathing exercises tailored to your needs.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Personalized Plans',
      description: 'Receive custom wellness plans based on your goals and progress.',
      color: 'from-green-500 to-green-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold gradient-heading mb-4">
            Comprehensive Mental Health Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to support your mental wellbeing journey, powered by AI
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="glass-card h-full hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-vyanamana-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Auto-advance indicator */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <p className="text-sm text-muted-foreground">
            Next: Discover our AI capabilities
          </p>
          <motion.div
            className="w-16 h-1 bg-vyanamana-500 mx-auto mt-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 2.5, duration: 3 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OnboardingFeatures;
