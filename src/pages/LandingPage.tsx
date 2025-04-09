
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight, MessageCircle, BarChart, Shield, Activity, Star, Heart } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const LandingPage: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.99] }
    }
  };
  
  const floatingParticles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 0.5}rem`,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 15
  }));

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gradient-radial from-lavender/10 to-transparent dark:from-deepPurple/5 blur-xl"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size,
              height: particle.size
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-24 md:py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-gradient opacity-50"></div>
          <motion.div 
            className="container mx-auto flex flex-col lg:flex-row items-center gap-16 relative"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              className="lg:w-1/2 space-y-8"
              variants={itemVariants}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="inline-block bg-gradient-to-r from-deepPurple/20 to-vyanamana-500/20 dark:from-deepPurple/10 dark:to-vyanamana-500/10 px-4 py-2 rounded-full backdrop-blur-sm border border-vyanamana-200/20 dark:border-vyanamana-700/20"
              >
                <span className="text-sm font-medium text-deepPurple dark:text-lavender">Breathe. Reflect. Heal.</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
                Your <span className="text-gradient-premium">Digital Companion</span> for Mental Wellbeing
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Vyānamana is here to listen, support, and guide you through your mental health journey. 
                Talk to our AI companion anytime, track your mood patterns, and discover insights that lead to better wellness.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/chat">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-premium shadow-premium hover:shadow-lg transition-all duration-300">
                    Start Chatting
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border border-vyanamana-300 dark:border-vyanamana-700 hover:bg-vyanamana-100/30 dark:hover:bg-vyanamana-900/30">
                    Create Account
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 flex justify-center"
              variants={itemVariants}
            >
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-radial from-lavender/30 to-transparent dark:from-deepPurple/20 rounded-full blur-3xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                
                <motion.div 
                  className="relative frost-panel p-8 rounded-2xl max-w-md"
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(107, 70, 193, 0.15)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vyanamana-400 to-vyanamana-600 flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-white font-bold text-sm">V</span>
                    </div>
                    <div className="chat-bubble-bot">
                      <p>Hi there! I'm Vyānamana, your mental wellness companion. How are you feeling today?</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mb-8">
                    <div className="chat-bubble-user">
                      <p>I've been feeling a bit overwhelmed lately with work...</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vyanamana-400 to-vyanamana-600 flex items-center justify-center shrink-0 shadow-md">
                      <span className="text-white font-bold text-sm">V</span>
                    </div>
                    <div className="chat-bubble-bot">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <p>I understand how that feels. Let's talk about some strategies that might help you manage work stress...</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section className="py-24 bg-vyanamana-50/50 dark:bg-vyanamana-950/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
          <motion.div 
            className="container mx-auto px-4"
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={containerVariants}
          >
            <motion.div 
              className="text-center mb-16 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-gradient-premium">Features Designed for Your Mental Wellbeing</h2>
              <p className="text-muted-foreground text-lg">
                Vyānamana combines AI-powered conversations with evidence-based mental health tools to support you on your journey.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="glass-card rounded-2xl p-8 shadow-glass hover:shadow-premium transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-vyanamana-100 to-vyanamana-200 dark:from-vyanamana-900 dark:to-vyanamana-800 text-vyanamana-600 dark:text-lavender flex items-center justify-center mb-6 shadow-md">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Supportive AI Companion</h3>
                <p className="text-muted-foreground">
                  Chat with our empathetic AI that's designed to listen, provide support, and offer evidence-based coping strategies in English or Hindi.
                </p>
              </motion.div>
              
              <motion.div 
                className="glass-card rounded-2xl p-8 shadow-glass hover:shadow-premium transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-vyanamana-100 to-vyanamana-200 dark:from-vyanamana-900 dark:to-vyanamana-800 text-vyanamana-600 dark:text-lavender flex items-center justify-center mb-6 shadow-md">
                  <BarChart className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Mood Tracking</h3>
                <p className="text-muted-foreground">
                  Log your emotions daily and visualize patterns over time to gain insights into your emotional wellbeing and identify triggers.
                </p>
              </motion.div>
              
              <motion.div 
                className="glass-card rounded-2xl p-8 shadow-glass hover:shadow-premium transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-vyanamana-100 to-vyanamana-200 dark:from-vyanamana-900 dark:to-vyanamana-800 text-vyanamana-600 dark:text-lavender flex items-center justify-center mb-6 shadow-md">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Private & Secure</h3>
                <p className="text-muted-foreground">
                  Your mental health data is private. We use strong encryption and never share your data with third parties.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>
        
        {/* How It Works */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
          <motion.div 
            className="container mx-auto"
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={containerVariants}
          >
            <motion.div 
              className="text-center mb-16 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-gradient-premium">How Vyānamana Works</h2>
              <p className="text-muted-foreground text-lg">
                Our platform combines AI technology with evidence-based mental health approaches to support your wellbeing.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vyanamana-100 to-vyanamana-200 dark:from-vyanamana-900 dark:to-vyanamana-800 text-deepPurple dark:text-lavender flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Your Account</h3>
                <p className="text-muted-foreground">
                  Sign up in seconds or try anonymously. Your privacy and security are our top priorities.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vyanamana-100 to-vyanamana-200 dark:from-vyanamana-900 dark:to-vyanamana-800 text-deepPurple dark:text-lavender flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Chat & Track</h3>
                <p className="text-muted-foreground">
                  Talk to your AI companion about your feelings and regularly log your mood to build awareness.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vyanamana-100 to-vyanamana-200 dark:from-vyanamana-900 dark:to-vyanamana-800 text-deepPurple dark:text-lavender flex items-center justify-center mx-auto mb-6 shadow-md">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Gain Insights</h3>
                <p className="text-muted-foreground">
                  Discover patterns and receive personalized suggestions to improve your mental wellbeing.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 bg-vyanamana-50/70 dark:bg-vyanamana-950/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-gradient-premium">What People Say</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Vyānamana has helped thousands of people on their mental wellbeing journey.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Vyānamana helped me identify patterns in my anxiety that I'd never noticed before. The AI companion feels human in its responses.",
                  author: "Sarah T.",
                  role: "Teacher"
                },
                {
                  quote: "Being able to talk in Hindi made all the difference for me. It's like having a therapist who truly understands my cultural context.",
                  author: "Rahul K.",
                  role: "Software Engineer"
                },
                {
                  quote: "The mood tracker has been a game changer for me. I can now connect my emotions to events and manage my stress more effectively.",
                  author: "Jamie L.",
                  role: "Healthcare Worker"
                }
              ].map((testimonial, i) => (
                <motion.div 
                  key={i}
                  className="glass-card rounded-2xl p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(107, 70, 193, 0.15)" }}
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="inline-block h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-foreground italic mb-6 flex-grow">"{testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-lavender/20 to-transparent dark:from-deepPurple/10 opacity-60"></div>
          <motion.div 
            className="container mx-auto px-4 text-center relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-gradient-premium">Begin Your Wellbeing Journey Today</h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                Take the first step towards better mental health with Vyānamana. 
                Our AI companion is ready to listen and support you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/chat">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto bg-gradient-premium shadow-premium hover:shadow-lg">
                    Start Chatting Now
                    <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 h-auto border-2 border-vyanamana-300 dark:border-vyanamana-700 hover:bg-vyanamana-100/30 dark:hover:bg-vyanamana-900/30">
                    Learn More
                    <Activity className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
