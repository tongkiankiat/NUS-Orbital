// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okxlnjjapcbfeygxewnz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reGxuamphcGNiZmV5Z3hld256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4NzQ4ODYsImV4cCI6MjAzNDQ1MDg4Nn0.euDA-waTY3silrmPV935ln3_1DqXociwYDDScXYRkPU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);