
import React from 'react';
import { Helmet } from 'react-helmet-async';
import CinematicOnboarding from '@/components/onboarding/CinematicOnboarding';

const CinematicOnboardingPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Welcome to Vyanman - Your AI Mental Health Companion</title>
        <meta name="description" content="Experience the future of mental wellness with Vyanman's AI-powered companion. Empowering emotional well-being through intelligent, empathetic support." />
        <meta name="theme-color" content="#0f172a" />
        <style>{`
          body {
            overflow: hidden;
            background: #000;
          }
        `}</style>
      </Helmet>
      
      <CinematicOnboarding />
    </>
  );
};

export default CinematicOnboardingPage;
