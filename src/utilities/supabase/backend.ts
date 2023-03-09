import { createClient } from "@supabase/supabase-js"

const backendSupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL, 
  process.env.SUPABASE_SECRET_KEY,
)

export default backendSupabaseClient