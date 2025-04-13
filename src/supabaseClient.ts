
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ppgflxqfjnfmntboxzpy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZ2ZseHFmam5mbW50Ym94enB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODU3NTEsImV4cCI6MjA2MDA2MTc1MX0.tQHoZwWX4cJmy1XUc4Q1AJ5iaIvb4eBb75bX3PZkAQ4';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
