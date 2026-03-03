import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://muhztdszuirjqyujsaot.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11aHp0ZHN6dWlyanF5dWpzYW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NjIwODUsImV4cCI6MjA4ODAzODA4NX0.eDH5X3C7uN7S4B05z2QZ9oB6l3ko5GVE0pkNCqxm0xQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);