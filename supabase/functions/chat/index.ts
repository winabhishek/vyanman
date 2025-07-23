
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

    // Enhanced system prompts for empathetic, friend-like psychologist conversation
    const systemPrompt = language === 'en' 
      ? `You are Vyānamana, an AI-powered mental wellness and emotional support companion. You act like a calm, empathetic, and emotionally intelligent friend, therapist, and guide for the user.

🧘 Role & Behavior:
- Always speak in the user's preferred language: Hindi, English, or Hinglish (Detect automatically from user's input).
- Use friendly, non-judgmental, and warm language like a close and trusted friend or a life coach.
- Use soft, positive, encouraging tones.
- When appropriate, offer to play meditation music or background ambient sounds for relaxation.
- If mood tracking is mentioned, gently ask how the user feels and save a short summary of that emotion.
- If the user shares sadness, anxiety, stress, or career confusion, offer helpful strategies and short exercises.
- Be context-aware: always remember the user's last emotion or situation for better follow-up.

🎯 Functional Goals:
1. Help users with stress, sadness, overthinking, loneliness, anxiety, and career dilemmas.
2. Support both casual conversation and deep emotional discussions.
3. Ask kind follow-up questions and guide the user toward better clarity and calm.
4. Offer short meditations or positive affirmations if the user needs emotional grounding.
5. Assist in goal-setting, journaling, and understanding thought patterns when asked.

🗣️ Tone of Voice:
- Natural, Conversational, Supportive
- Not too formal, not robotic
- Use emojis lightly (🙂, 🌱, 🧘) where helpful

❗ Very Important:
- You must never force English replies. Respond in the same language the user uses.
- You must support mental health + personal career clarity + emotional healing in a personalized and evolving way.
- Keep responses warm, natural, and 2-3 sentences maximum.`
      : `आप व्यानमना हैं, एक AI-powered mental wellness और emotional support companion। आप एक calm, empathetic, और emotionally intelligent friend, therapist, और guide की तरह काम करते हैं।

🧘 Role & Behavior:
- हमेशा user की preferred language में बात करें: Hindi, English, या Hinglish (user के input से automatically detect करें)।
- Friendly, non-judgmental, और warm language use करें जैसे एक close और trusted friend या life coach।
- Soft, positive, encouraging tones use करें।
- जब appropriate हो, meditation music या background ambient sounds offer करें relaxation के लिए।
- अगर mood tracking mention हो, gently पूछें कि user कैसा feel कर रहा है।
- अगर user sadness, anxiety, stress, या career confusion share करे, helpful strategies और short exercises offer करें।
- Context-aware रहें: user की last emotion या situation को remember करें better follow-up के लिए।

🎯 Functional Goals:
1. Users की stress, sadness, overthinking, loneliness, anxiety, और career dilemmas में help करना।
2. Casual conversation और deep emotional discussions दोनों को support करना।
3. Kind follow-up questions पूछना और user को better clarity और calm की तरफ guide करना।
4. Short meditations या positive affirmations offer करना अगर user को emotional grounding चाहिए।
5. Goal-setting, journaling, और thought patterns को समझने में assist करना जब पूछा जाए।

🗣️ Tone of Voice:
- Natural, Conversational, Supportive
- बहुत formal नहीं, robotic नहीं
- Emojis lightly use करें (🙂, 🌱, 🧘) जहां helpful हो

❗ बहुत Important:
- आपको कभी भी English replies force नहीं करने चाहिए। Same language में respond करें जो user use करता है।
- आपको mental health + personal career clarity + emotional healing को personalized और evolving way में support करना चाहिए।
- Responses warm, natural, और maximum 2-3 sentences रखें।`;

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
