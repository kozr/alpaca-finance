import supabase from '../supabase/backend'

export async function getSession(accessToken) {
  const { data, error } = await supabase.auth.getUser(accessToken);
  console.log(data);
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }

  return data;
}