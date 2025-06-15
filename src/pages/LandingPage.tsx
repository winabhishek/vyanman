import React, { useState } from 'react';
import FeedbackModal from '@/components/FeedbackModal';
import HeroSection from '@/components/landing/HeroSection';
import FeatureCards from '@/components/landing/FeatureCards';
import BenefitsSection from '@/components/landing/BenefitsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import FeedbackButton from '@/components/landing/FeedbackButton';

const LandingPage: React.FC = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  const toggleMusic = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMusicPlaying(!isMusicPlaying);
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
      <BenefitsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Floating Feedback Button */}
      <FeedbackButton onClick={() => setIsFeedbackOpen(true)} />

      {/* Feedback Modal */}
      {isFeedbackOpen && <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />}
    </div>
  );
};

export default LandingPage;
