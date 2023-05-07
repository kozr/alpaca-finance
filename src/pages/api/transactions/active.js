import supabaseClient from "@utility/supabase/backend"

export default async function handler(req, res) {
  const { data, error } = await supabaseClient
    .from("transaction")
    .select("*")
    .eq("state", "pending")
  if (error) {
    return res.status(500).json({ error })
  }
  return res.status(200).json({ data })
}