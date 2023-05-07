import supabaseClient from "@/utilities/supabase/frontend";

const api = {
  async fetch(url, options = {}) {
    console.log("api.fetch")
    const { data, error } = await supabaseClient.auth.getSession();
    const accessToken = data?.session?.access_token;
    console.log(accessToken);

    // Ensure headers object exists and merge with Authorization header
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    };

    return fetch(url, options);
  }
};

export default api;