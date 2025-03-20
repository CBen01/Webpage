import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hizgcpgzmireapqliudy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpemdjcGd6bWlyZWFwcWxpdWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MTg5MjAsImV4cCI6MjA1MTk5NDkyMH0.e7UwYnLSBbsOA5kWW8GAQgORwisj4xbykJ0FmpfiCf0";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;