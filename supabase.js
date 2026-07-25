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

        // Keep local custom session in sync with Supabase auth state
        supabaseClient.auth.onAuthStateChange((event, session) => {
            if (session) {
                localStorage.setItem('palengke_session', JSON.stringify({
                    user: session.user.email || session.user.user_metadata?.full_name,
                    role: 'member',
                    supabaseUserId: session.user.id,
                    accessToken: session.access_token,
                    refreshToken: session.refresh_token
                }));
            } else if (event === 'SIGNED_OUT') {
                localStorage.removeItem('palengke_session');
            }
        });
    } else {
        console.error('Supabase library not loaded');
        supabaseClient = null;
    }
} catch (error) {
    console.error('Error initializing Supabase client:', error);
    supabaseClient = null;
}