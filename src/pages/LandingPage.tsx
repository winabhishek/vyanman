
import React, { useState } from 'react';
import FeedbackModal from '@/components/FeedbackModal';
import HeroSection from '@/components/landing/HeroSection';
import FeatureCards from '@/components/landing/FeatureCards';
import FeedbackButton from '@/components/landing/FeedbackButton';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, HeartPulse, Brain, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  const toggleMusic = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMusicPlaying(!isMusicPlaying);
  };

  const testimonials = [
    {
      text: "Vyanman has transformed my daily mental health routine. The guided meditations are incredibly calming.",
      author: "Sarah K."
    },
    {
      text: "The mood tracker helped me identify patterns I never noticed before. Now I can make better lifestyle choices.",
      author: "Michael T."
    },
    {
      text: "The AI chat companion feels surprisingly human. I use it whenever I need someone to talk to at 2am.",
      author: "Jamie L."
    }
  ];

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="pb-24 relative">
      {/* Hero Section */}
      <HeroSection />

      {/* Feature Cards Section */}
      <div id="features">
        <FeatureCards 
          isMusicPlaying={isMusicPlaying} 
          toggleMusic={toggleMusic} 
        />
      </div>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl font-bold gradient-heading mb-4">
              How <span className="vyanman-brand">Vyanman</span> Helps You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered tools work together to support your mental wellbeing journey
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {[
              {
                icon: <MessageCircle className="h-8 w-8 text-vyanamana-500" />,
                title: "24/7 Support",
                description: "Our AI companion is always available for a supportive conversation whenever you need it."
              },
              {
                icon: <HeartPulse className="h-8 w-8 text-vyanamana-500" />,
                title: "Mindful Moments",
                description: "Guided breathing and meditation exercises help reduce stress and anxiety."
              },
              {
                icon: <Brain className="h-8 w-8 text-vyanamana-500" />,
                title: "Mental Clarity",
                description: "Digital detox tools help clear mental fog and improve focus."
              },
              {
                icon: <Smile className="h-8 w-8 text-vyanamana-500" />,
                title: "Emotional Insights",
                description: "Track your moods to discover patterns and improve emotional awareness."
              }
            ].map((benefit, index) => (
              <motion.div key={index} variants={fadeInUpVariants}>
                <Card className="glass-card h-full">
                  <CardContent className="pt-6 px-5 text-center">
                    <div className="mb-4 inline-flex p-3 rounded-full bg-vyanamana-500/10">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl font-bold gradient-heading mb-4">
              What Our Users Say
            </h2>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUpVariants}>
                <Card className="glass-card h-full">
                  <CardContent className="pt-6 px-5">
                    <p className="italic mb-4">"{testimonial.text}"</p>
                    <p className="text-right text-muted-foreground">— {testimonial.author}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center glass-card p-8 md:p-12 rounded-2xl bg-gradient-to-r from-vyanamana-900/30 to-vyanamana-800/30"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl font-bold gradient-heading mb-4">
              Begin Your Wellness Journey Today
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Take the first step toward better mental health and emotional balance with our AI-powered companion.
            </p>
            <Link to="/chat">
              <Button size="lg" className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-600 hover:from-vyanamana-600 hover:to-vyanamana-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Start Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Floating Feedback Button */}
      <FeedbackButton onClick={() => setIsFeedbackOpen(true)} />

      {/* Feedback Modal */}
      {isFeedbackOpen && <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />}
    </div>
  );
};

export default LandingPage;
