import { createClient } from "@supabase/supabase-js";

export const getServerSupabaseClient = () => {
  const serverSupabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
    process.env.SUPABASE_SECRET_KEY
  );

  return serverSupabaseClient;
};