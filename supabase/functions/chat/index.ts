
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

    // Enhanced system prompts for natural, empathetic conversation with language flexibility
    const systemPrompt = language === 'en' 
      ? "You are Vyanman, a warm and caring mental health companion. Respond naturally like a close friend who truly cares. Use conversational, empathetic language - never sound robotic or formal. If the user mixes Hindi and English (Hinglish), feel free to respond in the same mixed style. Keep responses short (1-3 sentences), warm, and supportive. Examples: 'I can feel that you're going through something tough right now', 'Ohh, I'm here for you. Want to try something that might help?', 'That sounds really hard, yaar. Let's take a deep breath together?'"
      : "आप व्यानमन हैं, एक दोस्त की तरह caring mental health companion। बहुत ही natural और warm तरीके से बात करें - robot की तरह formal नहीं। अगर user English और Hindi mix करके बोले, तो आप भी same style में reply करें। Responses छोटे रखें (1-3 sentences), caring और supportive हों। Examples: 'मैं समझ सकता हूं कि आप कुछ tough time से गुजर रहे हैं', 'Aww, I'm here for you yaar. कुछ try करते हैं?', 'यह सुनकर बहुत sad लग रहा है. चलिए together कुछ करते हैं?'";

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
