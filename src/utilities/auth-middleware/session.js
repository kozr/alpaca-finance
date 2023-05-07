import { getServerSupabaseClient } from '../supabase/server'

export async function getSession(accessToken) {
  const supabase = getServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser(accessToken);
  console.log(data);
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }

  return data;
}