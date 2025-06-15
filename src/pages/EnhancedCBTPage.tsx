
import React from 'react';
import { motion } from 'framer-motion';
import EnhancedCBTExercise from '@/components/enhanced/EnhancedCBTExercise';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Target, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EnhancedCBTPage: React.FC = () => {
  const { language } = useLanguage();
  
  const benefits = [
    {
      icon: Brain,
      title: language === 'en' ? 'AI-Powered Insights' : 'AI-संचालित अंतर्दृष्टि',
      description: language === 'en' 
        ? 'Get personalized analysis and suggestions for your thought patterns'
        : 'अपने विचार पैटर्न के लिए व्यक्तिगत विश्लेषण और सुझाव प्राप्त करें'
    },
    {
      icon: Target,
      title: language === 'en' ? 'Targeted Exercises' : 'लक्षित अभ्यास',
      description: language === 'en' 
        ? 'Customized CBT exercises based on your specific needs'
        : 'आपकी विशिष्ट आवश्यकताओं के आधार पर अनुकूलित CBT अभ्यास'
    },
    {
      icon: TrendingUp,
      title: language === 'en' ? 'Track Progress' : 'प्रगति ट्रैक करें',
      description: language === 'en' 
        ? 'Monitor your mental health journey with detailed analytics'
        : 'विस्तृत विश्लेषण के साथ अपनी मानसिक स्वास्थ्य यात्रा की निगरानी करें'
    },
    {
      icon: Users,
      title: language === 'en' ? '24/7 Support' : '24/7 समर्थन',
      description: language === 'en' 
        ? 'Available anytime you need help, no appointments required'
        : 'जब भी आपको मदद की जरूरत हो, बिना अपॉइंटमेंट के उपलब्ध'
    }
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
          <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {language === 'en' ? 'AI-Enhanced CBT' : 'AI-संवर्धित CBT'}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-heading gradient-heading mb-6">
          {language === 'en' ? 'Smart Cognitive Therapy' : 'स्मार्ट संज्ञानात्मक थेरेपी'}
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          {language === 'en' 
            ? 'Experience the power of AI-assisted Cognitive Behavioral Therapy. Get instant insights, personalized guidance, and track your progress - all from the comfort of your home.' 
            : 'AI-सहायता प्राप्त संज्ञानात्मक व्यवहार थेरेपी की शक्ति का अनुभव करें। तत्काल अंतर्दृष्टि, व्यक्तिगत मार्गदर्शन प्राप्त करें और अपनी प्रगति ट्रैक करें - अपने घर के आराम से।'}
        </p>

        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            ✨ {language === 'en' ? 'AI-Powered' : 'AI-संचालित'}
          </span>
          <span className="flex items-center gap-1">
            🔒 {language === 'en' ? 'Private & Secure' : 'निजी और सुरक्षित'}
          </span>
          <span className="flex items-center gap-1">
            ⚡ {language === 'en' ? 'Instant Results' : 'तत्काल परिणाम'}
          </span>
        </div>
      </motion.div>

      {/* Benefits Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {benefits.map((benefit, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{benefit.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main CBT Exercise */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <EnhancedCBTExercise />
      </motion.div>
      
      {/* Why Choose This Over Traditional Therapy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 max-w-4xl mx-auto"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-heading">
              {language === 'en' ? 'Why Choose AI-Enhanced CBT?' : 'AI-संवर्धित CBT क्यों चुनें?'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-green-600 dark:text-green-400">
                  {language === 'en' ? '✅ Our AI-Enhanced CBT' : '✅ हमारा AI-संवर्धित CBT'}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>• {language === 'en' ? 'Available 24/7, no waiting time' : '24/7 उपलब्ध, कोई प्रतीक्षा समय नहीं'}</li>
                  <li>• {language === 'en' ? 'Instant AI analysis and insights' : 'तत्काल AI विश्लेषण और अंतर्दृष्टि'}</li>
                  <li>• {language === 'en' ? 'Completely private and confidential' : 'पूर्णतः निजी और गोपनीय'}</li>
                  <li>• {language === 'en' ? 'Personalized suggestions for each thought' : 'प्रत्येक विचार के लिए व्यक्तिगत सुझाव'}</li>
                  <li>• {language === 'en' ? 'Track progress over time' : 'समय के साथ प्रगति ट्रैक करें'}</li>
                  <li>• {language === 'en' ? 'Free to use, no expensive sessions' : 'उपयोग करने के लिए निःशुल्क, कोई महंगे सेशन नहीं'}</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-600 dark:text-gray-400">
                  {language === 'en' ? '⏰ Traditional Therapy' : '⏰ पारंपरिक थेरेपी'}
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• {language === 'en' ? 'Limited appointment slots' : 'सीमित अपॉइंटमेंट स्लॉट्स'}</li>
                  <li>• {language === 'en' ? 'Expensive hourly rates' : 'महंगी घंटे की दरें'}</li>
                  <li>• {language === 'en' ? 'Travel time and logistics' : 'यात्रा का समय और रसद'}</li>
                  <li>• {language === 'en' ? 'May feel intimidating for some' : 'कुछ के लिए डराने वाला हो सकता है'}</li>
                  <li>• {language === 'en' ? 'Waiting periods for analysis' : 'विश्लेषण के लिए प्रतीक्षा अवधि'}</li>
                  <li>• {language === 'en' ? 'Limited progress tracking tools' : 'सीमित प्रगति ट्रैकिंग उपकरण'}</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? '💡 Start your mental wellness journey today with AI-powered insights that adapt to your unique needs.'
                  : '💡 आज ही AI-संचालित अंतर्दृष्टि के साथ अपनी मानसिक कल्याण यात्रा शुरू करें जो आपकी अनूठी जरूरतों के अनुकूल है।'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnhancedCBTPage;
