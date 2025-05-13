
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
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse the request body
    const { content, language = 'en' } = await req.json() as ChatRequest;

    if (!content) {
      return new Response(JSON.stringify({ error: 'Message content is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing chat request: ${content} in language: ${language}`);

    // Call the Together API
    const systemPrompt = language === 'en' 
      ? "You are Vyanman, an empathetic mental health companion. Respond in English. Offer emotional support and avoid repeating the same lines."
      : "आप व्यानमन हैं, एक सहानुभूतिपूर्ण मानसिक स्वास्थ्य साथी। हिंदी में जवाब दें। भावनात्मक समर्थन प्रदान करें और एक ही लाइनों को दोहराने से बचें।";

    const togetherResponse = await fetch(TOGETHER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOGETHER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.1",
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
        temperature: 0.7
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
      (language === 'en' ? "I'm here for you." : "मैं आपके लिए यहां हूँ।");

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

    return new Response(
      JSON.stringify({
        message: {
          id: botMessageData?.id || `bot-msg-${Date.now()}`,
          content: botReply,
          sender: 'bot',
          timestamp: botMessageData?.created_at || new Date(),
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
