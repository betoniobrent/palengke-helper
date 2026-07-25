/**
 * Palengke Helper+ - Supabase Client Configuration
 * Database Integration Layer (supabase.js)
 */

const SUPABASE_URL = 'https://hurqvygjmaamrynuptuo.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_5uEs9q8sYfr8fR9OBZGxXA_c6nQ2QGD';

let supabaseClient;

try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLIC_KEY
        );
    } else {
        console.error('Supabase library not loaded');
        supabaseClient = null;
    }
} catch (error) {
    console.error('Error initializing Supabase client:', error);
    supabaseClient = null;
}