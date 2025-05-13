
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Thought {
  automaticThought: string;
  distortion: string;
  rationalResponse: string;
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

const CBTExercise: React.FC = () => {
  const { language } = useLanguage();
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [currentThought, setCurrentThought] = useState<Thought>({
    automaticThought: '',
    distortion: '',
    rationalResponse: ''
  });
  const [activeTab, setActiveTab] = useState('add');
  
  const handleInputChange = (field: keyof Thought, value: string) => {
    setCurrentThought(prev => ({ ...prev, [field]: value }));
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
      rationalResponse: ''
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
      rationalResponse: ''
    });
  };
  
  const renderAddTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-md font-medium mb-2">
          {language === 'en' ? 'Automatic Thought' : 'स्वचालित विचार'}
        </h3>
        <Textarea
          placeholder={
            language === 'en'
              ? 'What thought is causing you distress?'
              : 'कौन सा विचार आपको परेशान कर रहा है?'
          }
          value={currentThought.automaticThought}
          onChange={(e) => handleInputChange('automaticThought', e.target.value)}
          rows={3}
        />
      </div>
      
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
                {language === 'en' ? 'Thought' : 'विचार'} {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium text-sm">
                  {language === 'en' ? 'Automatic Thought:' : 'स्वचालित विचार:'}
                </p>
                <p className="text-muted-foreground">{thought.automaticThought}</p>
              </div>
              
              {thought.distortion && (
                <div>
                  <p className="font-medium text-sm">
                    {language === 'en' ? 'Distortion:' : 'विकृति:'}
                  </p>
                  <p className="text-muted-foreground">
                    {distortionTypes[language === 'en' ? 'en' : 'hi'].find(
                      d => d.value === thought.distortion
                    )?.label || thought.distortion}
                  </p>
                </div>
              )}
              
              {thought.rationalResponse && (
                <div>
                  <p className="font-medium text-sm">
                    {language === 'en' ? 'Rational Response:' : 'तार्किक प्रतिक्रिया:'}
                  </p>
                  <p className="text-muted-foreground">{thought.rationalResponse}</p>
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
        <CardTitle>
          {language === 'en' ? 'Cognitive Behavioral Exercise' : 'संज्ञानात्मक व्यवहार व्यायाम'}
        </CardTitle>
        <CardDescription>
          {language === 'en'
            ? 'Identify negative thought patterns and challenge them with rational responses'
            : 'नकारात्मक विचार पैटर्न की पहचान करें और उन्हें तार्किक प्रतिक्रियाओं से चुनौती दें'}
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

export default CBTExercise;
