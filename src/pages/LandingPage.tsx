
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, BarChart, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 px-4">
          <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold gradient-heading leading-tight">
                Your Digital Companion for Mental Wellbeing
              </h1>
              <p className="text-lg text-muted-foreground">
                Vyānamana is here to listen, support, and guide you through your mental health journey. 
                Talk to our AI companion anytime, track your mood patterns, and discover insights that lead to better wellness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/chat">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Chatting
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-vyanamana-200 to-vyanamana-100 rounded-full blur-3xl opacity-20 animate-pulse-subtle"></div>
                <div className="relative glass-card p-6 rounded-xl max-w-md">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vyanamana-400 to-vyanamana-600 flex items-center justify-center shrink-0">
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-vyanamana-400 to-vyanamana-600 flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">V</span>
                    </div>
                    <div className="chat-bubble-bot">
                      <p>I understand how that feels. Let's talk about some strategies that might help you manage work stress...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Features Designed for Your Mental Wellbeing</h2>
              <p className="text-muted-foreground">
                Vyānamana combines AI-powered conversations with evidence-based mental health tools to support you on your journey.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 rounded-lg bg-vyanamana-100 text-vyanamana-600 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Supportive AI Companion</h3>
                <p className="text-muted-foreground">
                  Chat with our empathetic AI that's designed to listen, provide support, and offer evidence-based coping strategies.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 rounded-lg bg-vyanamana-100 text-vyanamana-600 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mood Tracking</h3>
                <p className="text-muted-foreground">
                  Log your emotions daily and visualize patterns over time to gain insights into your emotional wellbeing.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 rounded-lg bg-vyanamana-100 text-vyanamana-600 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Private & Secure</h3>
                <p className="text-muted-foreground">
                  Your mental health data is private. We use strong encryption and never share your data with third parties.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials/How It Works */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">How Vyānamana Works</h2>
              <p className="text-muted-foreground">
                Our platform combines AI technology with evidence-based mental health approaches to support your wellbeing.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-vyanamana-100 text-vyanamana-800 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create Your Account</h3>
                <p className="text-muted-foreground">
                  Sign up in seconds or try anonymously. Your privacy and security are our top priorities.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-vyanamana-100 text-vyanamana-800 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Chat & Track</h3>
                <p className="text-muted-foreground">
                  Talk to your AI companion about your feelings and regularly log your mood to build awareness.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-vyanamana-100 text-vyanamana-800 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Gain Insights</h3>
                <p className="text-muted-foreground">
                  Discover patterns and receive personalized suggestions to improve your mental wellbeing.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-vyanamana-50 dark:bg-vyanamana-950/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">Begin Your Wellbeing Journey Today</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the first step towards better mental health with Vyānamana. 
              Our AI companion is ready to listen and support you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/chat">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Chatting Now
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
