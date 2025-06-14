
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { enhancedChatAPI } from '@/services/enhancedChatAPI';
import { Brain, MessageCircle, Lightbulb } from 'lucide-react';

interface EnhancedThought {
  automaticThought: string;
  distortion: string;
  rationalResponse: string;
  aiSuggestion?: string;
  emotion: string;
  situation: string;
}

const distortionTypes = {
  en: [
    { value: 'all-or-nothing', label: 'All-or-Nothing Thinking' },
    { value: 'overgeneralization', label: 'Overgeneralization' },
    { value: 'mental-filter', label: 'Mental Filter' },
    { value: 'discounting-positive', label: 'Discounting the Positive' },
    { value: 'jumping-conclusions', label: 'Jumping to Conclusions' },
    { value: 'magnification', label: 'Magnification or Minimization' },
    { value: 'emotional-reasoning', label: 'Emotional Reasoning' },
    { value: 'should-statements', label: 'Should Statements' },
    { value: 'labeling', label: 'Labeling' },
    { value: 'personalization', label: 'Personalization & Blame' }
  ],
  hi: [
    { value: 'all-or-nothing', label: 'सब या कुछ नहीं सोच' },
    { value: 'overgeneralization', label: 'अति-सामान्यीकरण' },
    { value: 'mental-filter', label: 'मानसिक फ़िल्टर' },
    { value: 'discounting-positive', label: 'सकारात्मक को नज़रअंदाज़ करना' },
    { value: 'jumping-conclusions', label: 'निष्कर्ष पर कूदना' },
    { value: 'magnification', label: 'आवर्धन या न्यूनीकरण' },
    { value: 'emotional-reasoning', label: 'भावनात्मक तर्क' },
    { value: 'should-statements', label: 'चाहिए कथन' },
    { value: 'labeling', label: 'लेबलिंग' },
    { value: 'personalization', label: 'व्यक्तिगतकरण और दोष' }
  ]
};

const EnhancedCBTExercise: React.FC = () => {
  const { language } = useLanguage();
  const [thoughts, setThoughts] = useState<EnhancedThought[]>([]);
  const [currentThought, setCurrentThought] = useState<EnhancedThought>({
    automaticThought: '',
    distortion: '',
    rationalResponse: '',
    emotion: '',
    situation: ''
  });
  const [activeTab, setActiveTab] = useState('add');
  const [isGettingAIHelp, setIsGettingAIHelp] = useState(false);
  
  const handleInputChange = (field: keyof EnhancedThought, value: string) => {
    setCurrentThought(prev => ({ ...prev, [field]: value }));
  };
  
  const getAIHelp = async () => {
    if (!currentThought.automaticThought) {
      toast.error(language === 'en' ? 'Please enter a thought first' : 'पहले एक विचार दर्ज करें');
      return;
    }
    
    setIsGettingAIHelp(true);
    
    try {
      const prompt = language === 'en' 
        ? `As a CBT therapist, help me analyze this automatic thought: "${currentThought.automaticThought}". Please suggest:
1. What cognitive distortion might this be
2. A more balanced, rational response
3. Questions to challenge this thought
Please be specific and helpful.`
        : `एक CBT चिकित्सक के रूप में, इस स्वचालित विचार का विश्लेषण करने में मेरी मदद करें: "${currentThought.automaticThought}"। कृपया सुझाएं:
1. यह कौन सी संज्ञानात्मक विकृति हो सकती है
2. एक अधिक संतुलित, तार्किक प्रतिक्रिया
3. इस विचार को चुनौती देने के लिए प्रश्न
कृपया विशिष्ट और सहायक बनें।`;
      
      const response = await enhancedChatAPI.sendMessage(prompt, language);
      
      setCurrentThought(prev => ({
        ...prev,
        aiSuggestion: response.content
      }));
      
      toast.success(
        language === 'en' 
          ? 'AI suggestions added!' 
          : 'AI सुझाव जोड़े गए!'
      );
    } catch (error) {
      console.error('Error getting AI help:', error);
      toast.error(
        language === 'en' 
          ? 'Unable to get AI help right now' 
          : 'अभी AI सहायता प्राप्त नहीं कर सकते'
      );
    } finally {
      setIsGettingAIHelp(false);
    }
  };
  
  const handleAddThought = () => {
    if (!currentThought.automaticThought) {
      toast.error(language === 'en' ? 'Please enter a thought' : 'कृपया एक विचार दर्ज करें');
      return;
    }
    
    setThoughts(prev => [...prev, { ...currentThought }]);
    setCurrentThought({
      automaticThought: '',
      distortion: '',
      rationalResponse: '',
      emotion: '',
      situation: ''
    });
    toast.success(
      language === 'en' 
        ? 'Thought recorded successfully' 
        : 'विचार सफलतापूर्वक दर्ज किया गया'
    );
    setActiveTab('history');
  };
  
  const handleClearThought = () => {
    setCurrentThought({
      automaticThought: '',
      distortion: '',
      rationalResponse: '',
      emotion: '',
      situation: ''
    });
  };
  
  const renderAddTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-md font-medium mb-2 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          {language === 'en' ? 'Situation' : 'स्थिति'}
        </h3>
        <Textarea
          placeholder={
            language === 'en'
              ? 'Describe the situation that triggered this thought...'
              : 'उस स्थिति का वर्णन करें जिसने इस विचार को जन्म दिया...'
          }
          value={currentThought.situation}
          onChange={(e) => handleInputChange('situation', e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <h3 className="text-md font-medium mb-2">
          {language === 'en' ? 'Emotion Felt' : 'महसूस की गई भावना'}
        </h3>
        <Textarea
          placeholder={
            language === 'en'
              ? 'How did you feel? (anxious, sad, angry, etc.)'
              : 'आपको कैसा लगा? (चिंतित, उदास, गुस्सा, आदि)'
          }
          value={currentThought.emotion}
          onChange={(e) => handleInputChange('emotion', e.target.value)}
          rows={1}
        />
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">
          {language === 'en' ? 'Automatic Thought' : 'स्वचालित विचार'}
        </h3>
        <Textarea
          placeholder={
            language === 'en'
              ? 'What thought went through your mind?'
              : 'आपके मन में कौन सा विचार आया?'
          }
          value={currentThought.automaticThought}
          onChange={(e) => handleInputChange('automaticThought', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={getAIHelp} 
          disabled={isGettingAIHelp || !currentThought.automaticThought}
          variant="outline"
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          {isGettingAIHelp 
            ? (language === 'en' ? 'Getting AI Help...' : 'AI सहायता मिल रही है...')
            : (language === 'en' ? 'Get AI Help' : 'AI सहायता लें')
          }
        </Button>
      </div>

      {currentThought.aiSuggestion && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            {language === 'en' ? 'AI Suggestions' : 'AI सुझाव'}
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
            {currentThought.aiSuggestion}
          </p>
        </div>
      )}
      
      <div>
        <h3 className="text-md font-medium mb-2">
          {language === 'en' ? 'Cognitive Distortion' : 'संज्ञानात्मक विकृति'}
        </h3>
        <select
          className="w-full p-2 border rounded-md bg-background"
          value={currentThought.distortion}
          onChange={(e) => handleInputChange('distortion', e.target.value)}
        >
          <option value="">
            {language === 'en' ? '-- Select a distortion --' : '-- एक विकृति चुनें --'}
          </option>
          {distortionTypes[language === 'en' ? 'en' : 'hi'].map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">
          {language === 'en' ? 'Rational Response' : 'तार्किक प्रतिक्रिया'}
        </h3>
        <Textarea
          placeholder={
            language === 'en'
              ? 'What is a more balanced thought?'
              : 'एक अधिक संतुलित विचार क्या है?'
          }
          value={currentThought.rationalResponse}
          onChange={(e) => handleInputChange('rationalResponse', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button onClick={handleAddThought} className="flex-1">
          {language === 'en' ? 'Record Thought' : 'विचार दर्ज करें'}
        </Button>
        <Button variant="outline" onClick={handleClearThought}>
          {language === 'en' ? 'Clear' : 'साफ करें'}
        </Button>
      </div>
    </div>
  );
  
  const renderHistoryTab = () => (
    <div className="space-y-4">
      {thoughts.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          {language === 'en'
            ? 'No thoughts recorded yet. Start by adding a thought.'
            : 'अभी तक कोई विचार दर्ज नहीं किया गया है। एक विचार जोड़कर शुरू करें।'}
        </p>
      ) : (
        thoughts.map((thought, index) => (
          <Card key={index} className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">
                {language === 'en' ? 'Thought Analysis' : 'विचार विश्लेषण'} {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {thought.situation && (
                <div>
                  <p className="font-medium text-sm text-blue-600 dark:text-blue-400">
                    {language === 'en' ? 'Situation:' : 'स्थिति:'}
                  </p>
                  <p className="text-muted-foreground text-sm">{thought.situation}</p>
                </div>
              )}
              
              {thought.emotion && (
                <div>
                  <p className="font-medium text-sm text-purple-600 dark:text-purple-400">
                    {language === 'en' ? 'Emotion:' : 'भावना:'}
                  </p>
                  <p className="text-muted-foreground text-sm">{thought.emotion}</p>
                </div>
              )}

              <div>
                <p className="font-medium text-sm text-red-600 dark:text-red-400">
                  {language === 'en' ? 'Automatic Thought:' : 'स्वचालित विचार:'}
                </p>
                <p className="text-muted-foreground text-sm">{thought.automaticThought}</p>
              </div>
              
              {thought.distortion && (
                <div>
                  <p className="font-medium text-sm text-orange-600 dark:text-orange-400">
                    {language === 'en' ? 'Distortion:' : 'विकृति:'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {distortionTypes[language === 'en' ? 'en' : 'hi'].find(
                      d => d.value === thought.distortion
                    )?.label || thought.distortion}
                  </p>
                </div>
              )}
              
              {thought.rationalResponse && (
                <div>
                  <p className="font-medium text-sm text-green-600 dark:text-green-400">
                    {language === 'en' ? 'Rational Response:' : 'तार्किक प्रतिक्रिया:'}
                  </p>
                  <p className="text-muted-foreground text-sm">{thought.rationalResponse}</p>
                </div>
              )}

              {thought.aiSuggestion && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-800">
                  <p className="font-medium text-sm text-blue-800 dark:text-blue-200 mb-1">
                    {language === 'en' ? 'AI Insights:' : 'AI अंतर्दृष्टि:'}
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm whitespace-pre-wrap">
                    {thought.aiSuggestion}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          {language === 'en' ? 'Enhanced CBT Exercise with AI' : 'AI के साथ उन्नत CBT व्यायाम'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Identify negative thought patterns with AI assistance and challenge them with rational responses'
            : 'AI सहायता के साथ नकारात्मक विचार पैटर्न की पहचान करें और उन्हें तार्किक प्रतिक्रियाओं से चुनौती दें'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="add">
              {language === 'en' ? 'Add Thought' : 'विचार जोड़ें'}
            </TabsTrigger>
            <TabsTrigger value="history">
              {language === 'en' ? 'Thought History' : 'विचार इतिहास'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="add">{renderAddTab()}</TabsContent>
          <TabsContent value="history">{renderHistoryTab()}</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedCBTExercise;
