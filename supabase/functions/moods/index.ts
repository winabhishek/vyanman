
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { corsHeaders } from '../_shared/cors.ts';

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

    if (req.method === 'POST') {
      // Parse the request body
      const { mood_type, note } = await req.json();

      if (!mood_type) {
        return new Response(JSON.stringify({ error: 'Mood type is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Save mood entry in database
      const { data: moodData, error: moodError } = await supabaseClient
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood_type,
          note,
        })
        .select('*')
        .single();

      if (moodError) {
        throw new Error(moodError.message);
      }

      return new Response(
        JSON.stringify({
          id: moodData.id,
          userId: moodData.user_id,
          mood: moodData.mood_type,
          note: moodData.note,
          timestamp: moodData.created_at
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (req.method === 'GET') {
      // Get all mood entries for the user
      const { data: moodEntries, error: moodEntriesError } = await supabaseClient
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (moodEntriesError) {
        throw new Error(moodEntriesError.message);
      }

      const formattedEntries = moodEntries.map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        mood: entry.mood_type,
        note: entry.note,
        timestamp: entry.created_at
      }));

      return new Response(
        JSON.stringify(formattedEntries),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
