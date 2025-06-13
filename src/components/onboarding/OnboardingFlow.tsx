
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  BarChart3, 
  Headphones, 
  Globe, 
  Clock, 
  Heart,
  ArrowRight,
  Sparkles,
  Brain,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface OnboardingFlowProps {
  onComplete?: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="welcome"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.4 }
            }}
            className="text-center space-y-8"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Logo and Brand */}
              <motion.div variants={itemVariants} className="space-y-4">
                <motion.div 
                  className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-vyanamana-500 to-vyanamana-700 flex items-center justify-center shadow-2xl"
                  variants={iconVariants}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Heart className="h-10 w-10 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold gradient-heading mb-2">
                    <span className="vyanman-brand">Vyanman</span>
                  </h1>
                  <motion.p 
                    className="text-xl text-vyanamana-600 font-medium"
                    variants={itemVariants}
                  >
                    Your Mind, Our Mission
                  </motion.p>
                </div>
              </motion.div>

              {/* Welcome Message */}
              <motion.div variants={itemVariants} className="max-w-md mx-auto">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Welcome to your personal AI mental health companion. Let's start your journey towards better mental wellness together.
                </p>
              </motion.div>

              {/* Floating Elements */}
              <motion.div 
                className="absolute top-10 left-10 w-6 h-6 bg-vyanamana-400/20 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute top-32 right-16 w-4 h-4 bg-vyanamana-500/30 rounded-full"
                animate={{
                  y: [0, 15, 0],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />

              {/* CTA Button */}
              <motion.div variants={itemVariants}>
                <Button
                  onClick={nextStep}
                  size="lg"
                  className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-600 hover:from-vyanamana-600 hover:to-vyanamana-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="features"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="space-y-8"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-6"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold gradient-heading mb-4">
                  AI-Powered Mental Wellness
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover how <span className="vyanman-brand">Vyanman</span> uses advanced AI to support your mental health journey
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    icon: <MessageCircle className="h-8 w-8" />,
                    title: "AI Chat Companion",
                    description: "24/7 supportive conversations with our empathetic AI assistant"
                  },
                  {
                    icon: <BarChart3 className="h-8 w-8" />,
                    title: "Mood Tracking",
                    description: "Track and analyze your emotional patterns with intelligent insights"
                  },
                  {
                    icon: <Headphones className="h-8 w-8" />,
                    title: "Guided Meditation",
                    description: "Personalized meditation and breathing exercises for your needs"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="glass-card h-full p-6 hover:shadow-xl transition-all duration-300">
                      <CardContent className="pt-0 text-center space-y-4">
                        <motion.div 
                          className="w-16 h-16 mx-auto rounded-full bg-vyanamana-500/10 flex items-center justify-center text-vyanamana-500"
                          variants={iconVariants}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {feature.icon}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} className="pt-6">
                <Button
                  onClick={nextStep}
                  size="lg"
                  className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-600 hover:from-vyanamana-600 hover:to-vyanamana-700 text-white px-8 py-3"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="differentiators"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="space-y-8"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-6"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold gradient-heading mb-4">
                  Why Choose <span className="vyanman-brand">Vyanman</span>?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Experience mental wellness support designed specifically for you
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    icon: <Globe className="h-8 w-8" />,
                    title: "Bilingual Support",
                    description: "Communicate in both Hindi and English for comfortable conversations",
                    color: "from-blue-500 to-blue-600"
                  },
                  {
                    icon: <Brain className="h-8 w-8" />,
                    title: "Personalized AI",
                    description: "Tailored suggestions based on your unique mental health patterns",
                    color: "from-purple-500 to-purple-600"
                  },
                  {
                    icon: <Clock className="h-8 w-8" />,
                    title: "24/7 Availability",
                    description: "Always here when you need support, day or night",
                    color: "from-green-500 to-green-600"
                  },
                  {
                    icon: <Users className="h-8 w-8" />,
                    title: "Cultural Sensitivity",
                    description: "Designed with Indian cultural context and values in mind",
                    color: "from-orange-500 to-orange-600"
                  },
                  {
                    icon: <Sparkles className="h-8 w-8" />,
                    title: "Evidence-Based",
                    description: "Grounded in proven mental health practices and therapies",
                    color: "from-pink-500 to-pink-600"
                  },
                  {
                    icon: <Heart className="h-8 w-8" />,
                    title: "Privacy First",
                    description: "Your conversations and data are completely secure and private",
                    color: "from-red-500 to-red-600"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -8, scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="glass-card h-full p-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-vyanamana-200/50">
                      <CardContent className="pt-0 text-center space-y-4">
                        <motion.div 
                          className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white shadow-lg`}
                          variants={iconVariants}
                          whileHover={{ scale: 1.1 }}
                        >
                          {feature.icon}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={itemVariants} className="pt-6">
                <Button
                  onClick={nextStep}
                  size="lg"
                  className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-600 hover:from-vyanamana-600 hover:to-vyanamana-700 text-white px-8 py-3"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="cta"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="text-center space-y-8"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants}>
                <motion.div 
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-vyanamana-500 to-vyanamana-700 flex items-center justify-center shadow-2xl mb-6"
                  variants={iconVariants}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="h-12 w-12 text-white" />
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold gradient-heading mb-4">
                  Ready to Begin?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Take the first step towards better mental health with <span className="vyanman-brand">Vyanman</span>. 
                  Your journey to wellness starts here.
                </p>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
              >
                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-vyanamana-500 to-vyanamana-600 hover:from-vyanamana-600 hover:to-vyanamana-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Login / Sign Up
                  </Button>
                </Link>
                <Link to="/chat" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-vyanamana-400/50 hover:bg-vyanamana-500/10 px-8 py-4 text-lg transition-all duration-300"
                  >
                    Explore Without Signup
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Join thousands who have transformed their mental wellness with <span className="vyanman-brand">Vyanman</span>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-vyanamana-50/30 dark:to-vyanamana-950/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-vyanamana-500/5"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, Math.random() * 0.5 + 0.8, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[0, 1, 2, 3].map((step) => (
          <motion.div
            key={step}
            className={`w-3 h-3 rounded-full ${
              step <= currentStep ? 'bg-vyanamana-500' : 'bg-vyanamana-200/50'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: step * 0.1 }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <AnimatePresence mode="wait" custom={1}>
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingFlow;
