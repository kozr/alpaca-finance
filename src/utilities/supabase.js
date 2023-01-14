import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env['SUPABASE_PROJECT_URL'], process.env['SUPABASE_API_KEY'])

export default supabase