import supabaseClient from "@/utilities/supabase/backend";

export default async function handler(req, res) {
  const { id, user_metadata } = req.body;
  const { avatar_url, email, full_name } = user_metadata;
  const [first_name, last_name] = full_name.split(" ");
  const { data, error } = await supabaseClient
    .from("user")
    .upsert({ id, email, first_name, last_name, avatar_url, balance: 0 })
    .select();

  if (error) {
    console.error(`error: ${JSON.stringify(error)}`);
    return res.status(500).json({ error: error });
  }

  console.log(`dummy: reached here (create user).`);
  res.status(200).json({ data: data });
}
