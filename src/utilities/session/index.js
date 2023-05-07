import supabaseClient from "../supabase/backend";

export async function getSession(accessToken) {
  const { data, error } = await supabaseClient.auth.api.getUser(accessToken);

  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }

  return data;
}