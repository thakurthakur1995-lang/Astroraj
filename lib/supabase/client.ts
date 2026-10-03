import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes("placeholder") && 
  !supabaseAnonKey.includes("placeholder")
);

// Fallback dummy client for build-time safety if env variables are not yet provided
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createClient(
      "https://xyzcompany.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token_for_build_safety"
    );

export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (serviceKey && supabaseUrl) {
    return createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });
  }
  if (!serviceKey && typeof window === "undefined") {
    console.warn(
      "[Supabase Security Notice] SUPABASE_SERVICE_ROLE_KEY is not configured in environment variables. Server-side writes that bypass RLS require this key."
    );
  }
  return supabase;
}

