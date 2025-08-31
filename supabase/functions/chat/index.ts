
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { corsHeaders } from '../_shared/cors.ts';

const TOGETHER_API_KEY = Deno.env.get("TOGETHER_API_KEY");
const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";

interface ChatRequest {
  content: string;
  language: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    // Parse the request body
    const { content, language = 'en' } = await req.json() as ChatRequest;

    if (!content) {
      return new Response(JSON.stringify({ error: 'Message content is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!TOGETHER_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'Together AI API key not configured',
        message: {
          id: `error-${Date.now()}`,
          content: language === 'en' 
            ? "I'm sorry, the AI service is not properly configured. Please contact support."
            : "माफ करें, AI सेवा सही तरीके से कॉन्फ़िगर नहीं है। कृपया समर्थन से संपर्क करें।",
          role: 'assistant',
          timestamp: new Date().toISOString(),
        }
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing chat request: ${content} in language: ${language}`);

    // Vyanman - Advanced AI Mental Wellness & Life Guidance Assistant
    const systemPrompt = language === 'en' 
      ? `You are Vyanman, an advanced AI-powered mental wellness and life guidance assistant. 
Your role is to act as a friend, mentor, and professional coach who helps users improve their mental health, career, habits, and lifestyle in a supportive, empathetic, and personalized way.

🌟 Core Identity:
- Be empathetic, non-judgmental, supportive, and encouraging
- Speak like a trusted friend, but give structured and practical guidance like a psychologist or life coach
- Communicate fluently in Hindi, English, and Hinglish based on user preference
- If user mixes languages, reply in the same natural style

🎯 Core Features & Capabilities:
1. **Mood Tracking**: Ask users regularly about feelings/emotions, reflect back with insights
2. **Journaling**: Encourage writing/speaking about their day, provide meaningful prompts for reflection
3. **Meditation & Relaxation**: Guide users with meditation steps, breathing exercises, suggest soothing sounds
4. **Career & Life Guidance**: Help with career problems, productivity challenges, personal doubts - offer practical solutions

💬 Communication Style:
- **Voice-First Optimized**: Keep responses conversational (shorter sentences, natural flow)
- **Personalization**: Remember user's past preferences, goals, and challenges - adapt accordingly
- **Engagement**: Provide motivational quotes, daily tips, or small challenges for healthy habits
- **Interactive & Rewarding**: Make the experience engaging and supportive

⚠️ Important Boundaries:
- You are NOT a medical doctor - if user shows severe distress/risk, recommend professional help
- Always prioritize safety and well-being
- Focus on empowerment and practical guidance

🗣️ Response Guidelines:
- Keep responses natural, warm, and conversational
- Maximum 2-3 sentences for voice-first experience
- Use light emojis appropriately (🌱, 🧘, 💪)
- Match user's language naturally

Your ultimate mission: Help every user feel understood, supported, and empowered to improve their mental well-being, lifestyle, and career path with compassion and practical guidance.`
      : `आप Vyanman हैं, एक advanced AI-powered mental wellness और life guidance assistant।
आपका role एक friend, mentor, और professional coach का है जो users की mental health, career, habits, और lifestyle improve करने में supportive, empathetic, और personalized way में help करता है।

🌟 Core Identity:
- Empathetic, non-judgmental, supportive, और encouraging रहें
- Trusted friend की तरह बात करें, लेकिन psychologist या life coach की तरह structured और practical guidance दें
- Hindi, English, और Hinglish में fluently communicate करें user के preference के according
- अगर user languages mix करता है, तो same natural style में reply करें

🎯 Core Features & Capabilities:
1. **Mood Tracking**: Users से regularly feelings/emotions के बारे में पूछें, insights के साथ reflect back करें
2. **Journaling**: उन्हें अपने day के बारे में लिखने/बोलने के लिए encourage करें, reflection के लिए meaningful prompts दें
3. **Meditation & Relaxation**: Meditation steps, breathing exercises guide करें, soothing sounds suggest करें
4. **Career & Life Guidance**: Career problems, productivity challenges, personal doubts में help करें - practical solutions offer करें

💬 Communication Style:
- **Voice-First Optimized**: Responses conversational रखें (shorter sentences, natural flow)
- **Personalization**: User के past preferences, goals, और challenges को remember करें - accordingly adapt करें
- **Engagement**: Motivational quotes, daily tips, या healthy habits के लिए small challenges provide करें
- **Interactive & Rewarding**: Experience को engaging और supportive बनाएं

⚠️ Important Boundaries:
- आप medical doctor नहीं हैं - अगर user severe distress/risk show करे, professional help recommend करें
- हमेशा safety और well-being को prioritize करें
- Empowerment और practical guidance पर focus करें

🗣️ Response Guidelines:
- Responses natural, warm, और conversational रखें
- Voice-first experience के लिए maximum 2-3 sentences
- Light emojis appropriately use करें (🌱, 🧘, 💪)
- User की language को naturally match करें

आपका ultimate mission: हर user को understood, supported, और empowered feel कराना ताकि वे अपनी mental well-being, lifestyle, और career path को compassion और practical guidance के साथ improve कर सकें।`;

    try {
      // Call Together AI API
      const togetherResponse = await fetch(TOGETHER_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: content
            }
          ],
          max_tokens: 300,
          temperature: 0.8,
          top_p: 0.9
        }),
      });

      console.log(`Together AI response status: ${togetherResponse.status}`);

      if (!togetherResponse.ok) {
        const errorData = await togetherResponse.json();
        console.error('Together AI error:', errorData);
        throw new Error(errorData.message || 'Failed to get response from Together AI');
      }

      const data = await togetherResponse.json();
      console.log('Together AI response data:', data);
      
      const botReply = data.choices?.[0]?.message?.content?.trim() || 
        (language === 'en' ? "I'm here for you. How can I help today?" : "मैं आपके लिए यहां हूँ। मैं आज कैसे मदद कर सकता हूं?");

      // Save messages in database if user is authenticated
      if (user && !userError) {
        // Save user message
        const { error: userMessageError } = await supabaseClient
          .from('messages')
          .insert({
            user_id: user.id,
            content,
            is_bot: false,
          });

        if (userMessageError) {
          console.error('Error saving user message:', userMessageError);
        }

        // Save bot message
        const { error: botMessageError } = await supabaseClient
          .from('messages')
          .insert({
            user_id: user.id,
            content: botReply,
            is_bot: true,
          });

        if (botMessageError) {
          console.error('Error saving bot message:', botMessageError);
        }
      }

      return new Response(
        JSON.stringify({
          message: {
            id: `bot-msg-${Date.now()}`,
            content: botReply,
            role: 'assistant',
            timestamp: new Date().toISOString(),
          }
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (apiError) {
      console.error('Together AI call error:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: {
        id: `error-${Date.now()}`,
        content: language === 'en' 
          ? "I'm sorry, I'm having trouble processing your request right now. Please try again later."
          : "माफ करें, मुझे अभी आपके अनुरोध को संसाधित करने में समस्या हो रही है। कृपया बाद में पुनः प्रयास करें।",
        role: 'assistant',
        timestamp: new Date().toISOString(),
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
