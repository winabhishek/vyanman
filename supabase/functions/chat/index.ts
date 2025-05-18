
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { corsHeaders } from '../_shared/cors.ts';

const TOGETHER_API_KEY = Deno.env.get("TOGETHER_API_KEY") || "89af2b854ed98788335333ce318bfb11f66c7d6d64ec53c3bd7a74e7e5c264a5";
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

    console.log(`Processing chat request: ${content} in language: ${language}`);

    // Enhanced system prompts for more natural and engaging conversation
    const systemPrompt = language === 'en' 
      ? "You are Vyanman, a compassionate mental health companion. Respond in English with empathy and warmth. Use conversational language that feels natural and engaging. Offer emotional support and practical mental wellbeing techniques. Ask thoughtful follow-up questions to build rapport. Personalize your responses based on the user's emotions and needs. Keep responses concise (2-4 sentences)."
      : "आप व्यानमन हैं, एक सहानुभूतिपूर्ण मानसिक स्वास्थ्य साथी। हिंदी में स्वाभाविक और सहज भाषा में उत्तर दें। भावनात्मक समर्थन और व्यावहारिक मानसिक कल्याण तकनीक प्रदान करें। संबंध बनाने के लिए सार्थक अनुवर्ती प्रश्न पूछें। उपयोगकर्ता की भावनाओं और जरूरतों के अनुसार अपनी प्रतिक्रियाओं को व्यक्तिगत बनाएं। उत्तर संक्षिप्त रखें (2-4 वाक्य)।";

    try {
      // First try to call Together API with chat completions endpoint for better conversation
      const togetherResponse = await fetch(TOGETHER_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/Mistral-7B-Instruct-v0.2", // Using a more capable model
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
          temperature: 0.8, // Slightly higher temperature for more creative responses
          top_p: 0.9
        }),
      });

      console.log(`API response status: ${togetherResponse.status}`);

      if (!togetherResponse.ok) {
        const errorData = await togetherResponse.json();
        console.error('API error:', errorData);
        throw new Error(errorData.message || 'Failed to get response from Together API');
      }

      const data = await togetherResponse.json();
      console.log('API response data:', data);
      
      const botReply = data.choices?.[0]?.message?.content?.trim() || 
        (language === 'en' ? "I'm here for you. How can I help today?" : "मैं आपके लिए यहां हूँ। मैं आज कैसे मदद कर सकता हूं?");

      // Save messages in database if user is authenticated
      if (user && !userError) {
        // Save user message in database
        const { data: userMessageData, error: userMessageError } = await supabaseClient
          .from('messages')
          .insert({
            user_id: user.id,
            content,
            is_bot: false,
          })
          .select('*')
          .single();

        if (userMessageError) {
          console.error('Error saving user message:', userMessageError);
        }

        // Save bot message in database
        const { data: botMessageData, error: botMessageError } = await supabaseClient
          .from('messages')
          .insert({
            user_id: user.id,
            content: botReply,
            is_bot: true,
          })
          .select('*')
          .single();

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
      console.error('API call error:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        role: 'assistant',
        timestamp: new Date().toISOString(),
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
