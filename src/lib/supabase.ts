import { createClient } from '@supabase/supabase-js';

// Fallback to a valid placeholder URL so the app won't crash on startup if not configured
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
if (!supabaseUrl.startsWith('http')) {
    supabaseUrl = 'https://placeholder.supabase.co';
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
    console.warn('Missing or placeholder Supabase environment variables. Please check your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey
);
