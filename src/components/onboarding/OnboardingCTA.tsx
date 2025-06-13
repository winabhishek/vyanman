
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RippleButton } from '@/components/ui/ripple-button';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingCTAProps {
  onPrevious: () => void;
}

const OnboardingCTA: React.FC<OnboardingCTAProps> = ({ onPrevious }) => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-6 h-6 text-vyanamana-400/30" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main CTA Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-vyanamana-500 via-vyanamana-600 to-vyanamana-700 flex items-center justify-center shadow-2xl"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 30px rgba(255, 184, 0, 0.4)",
                "0 0 60px rgba(255, 184, 0, 0.6)",
                "0 0 30px rgba(255, 184, 0, 0.4)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-5xl font-bold text-white">V</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold gradient-heading mb-6">
            Start Your Mental Wellness Journey
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who have transformed their mental health with 
            <span className="text-vyanamana-500 font-semibold"> Vyanman</span>. 
            Your journey to better wellbeing starts today.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link to="/login">
            <RippleButton
              size="lg"
              className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-600 hover:from-vyanamana-600 hover:to-vyanamana-700 text-white px-8 py-4 text-lg shadow-2xl hover:shadow-vyanamana-500/25 transition-all duration-300 group"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </RippleButton>
          </Link>
          
          <Link to="/chat">
            <Button
              variant="outline"
              size="lg"
              className="border-vyanamana-400/50 hover:bg-vyanamana-500/10 px-8 py-4 text-lg"
            >
              Explore Without Signup
            </Button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="space-y-2">
            <div className="text-3xl font-bold text-vyanamana-500">24/7</div>
            <p className="text-sm text-muted-foreground">Always Available Support</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-vyanamana-500">100%</div>
            <p className="text-sm text-muted-foreground">Private & Secure</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-vyanamana-500">AI</div>
            <p className="text-sm text-muted-foreground">Powered Mental Health</p>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          className="mt-12 text-sm text-muted-foreground italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          "Your Mind, Our Mission" - Begin your transformation today.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default OnboardingCTA;
