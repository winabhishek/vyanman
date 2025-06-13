
import React from 'react';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleOnboardingComplete = () => {
    // Redirect to chat or main app after onboarding
    navigate('/chat');
  };

  return (
    <div className="relative">
      <OnboardingFlow onComplete={handleOnboardingComplete} />
    </div>
  );
};

export default OnboardingPage;
