
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-heading mb-6">About <span className="vyanman-brand">Vyanman</span></h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="lead text-xl text-muted-foreground mb-8">
          <span className="vyanman-brand">Vyanman</span>—derived from Sanskrit—means "to breathe intentionally" or "conscious awareness." 
          Our platform embodies this principle by offering a space for mindful reflection on your mental wellbeing.
        </p>
        
        <h2 className="text-2xl font-semibold mt-12 mb-4">Our Mission</h2>
        <p>
          At <span className="vyanman-brand">Vyanman</span>, we believe mental health support should be accessible to everyone, whenever they need it. 
          Our AI companion is designed to provide a judgment-free space for expression, 
          reflection, and growth on your mental wellness journey.
        </p>
        
        <h2 className="text-2xl font-semibold mt-12 mb-4">How We Can Help</h2>
        <p>
          <span className="vyanman-brand">Vyanman</span> combines artificial intelligence with evidence-based mental health approaches to offer:
        </p>
        <ul>
          <li>A 24/7 AI companion that listens and responds with empathy</li>
          <li>Mood tracking tools to help you understand your emotional patterns</li>
          <li>Evidence-based techniques for managing stress, anxiety, and other challenges</li>
          <li>A private space to process your thoughts and feelings</li>
        </ul>
        
        <div className="bg-vyanamana-50 dark:bg-vyanamana-900/20 p-6 rounded-lg my-8 border border-vyanamana-100 dark:border-vyanamana-800">
          <h3 className="text-xl font-medium mb-2">Important Disclaimer</h3>
          <p className="text-muted-foreground">
            <span className="vyanman-brand">Vyanman</span> is not a substitute for professional mental health care. If you're experiencing
            a mental health crisis or need immediate support, please contact a mental health professional,
            visit your nearest emergency room, or call the 988 Suicide & Crisis Lifeline.
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold mt-12 mb-4">Our Approach to AI and Mental Health</h2>
        <p>
          We've designed our AI companion with sensitivity and care, training it to respond appropriately
          to a wide range of mental health topics. However, we recognize the limitations of AI technology
          and prioritize your safety above all.
        </p>
        <p>
          Our platform uses advanced sentiment analysis to better understand your emotional state and
          provide more relevant support. All interactions are completely private and secure.
        </p>
        
        <h2 className="text-2xl font-semibold mt-12 mb-4">Get Started Today</h2>
        <p>
          Begin your journey with <span className="vyanman-brand">Vyanman</span> in just a few clicks. Create an account to track your
          progress over time, or use our anonymous mode for immediate support without registration.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link to="/chat">
            <Button className="flex items-center gap-2">
              Start Chatting Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
