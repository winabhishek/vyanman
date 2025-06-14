
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RippleButton } from '@/components/ui/ripple-button';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-vyanamana-950/20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-vyanamana-500/5 via-transparent to-vyanamana-800/10" />
      
      {/* Animated Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-vyanamana-400/20 dark:bg-vyanamana-300/10"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * -100 - 50, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="w-24 h-24 mx-auto">
            <img 
              src="/lovable-uploads/04602118-4a1a-43ab-ae66-6511477eabc7.png" 
              alt="Vyanman Logo" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold gradient-heading mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Meet <span className="vyanman-brand">Vyanman</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Your AI-powered mental health companion.
          <span className="block mt-2 text-vyanamana-500 font-medium">
            Personalized support, anytime, anywhere.
          </span>
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="text-lg text-muted-foreground/80 mb-12 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          "Your Mind, Our Mission"
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Link to="/cinematic-onboarding">
            <RippleButton
              size="lg"
              className="bg-gradient-to-r from-vyanamana-500 to-vyanamana-600 hover:from-vyanamana-600 hover:to-vyanamana-700 text-white px-8 py-4 text-lg shadow-2xl hover:shadow-vyanamana-500/25 transition-all duration-300 group"
            >
              <Play className="mr-2 w-5 h-5" />
              Experience Vyanman
            </RippleButton>
          </Link>

          <Link to="/onboarding">
            <Button
              variant="outline"
              size="lg"
              className="border-vyanamana-400/50 hover:bg-vyanamana-500/10 px-8 py-4 text-lg group"
            >
              Quick Tour
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            { icon: "🤖", title: "AI Companion", desc: "24/7 empathetic support" },
            { icon: "📊", title: "Mood Tracking", desc: "Understand your patterns" },
            { icon: "🧘", title: "Meditation", desc: "Guided mindfulness" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
