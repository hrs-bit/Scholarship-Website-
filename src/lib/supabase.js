import { createClient } from '@supabase/supabase-js'

// Credentials are loaded from .env (never hardcoded).
// The Supabase JS SDK sends all queries as parameterized statements
// internally — no raw SQL string interpolation is used here,
// so there is no SQL injection risk from client-submitted data.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[ScholarPath] Supabase env vars not found. ' +
    'Auth and form submission will be unavailable. ' +
    'Copy .env.example → .env and fill in your project credentials.'
  )
}

// Export null if credentials missing — components must guard against this
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null
