import supabaseClient from "@/utilities/supabase/backend";

export default async function handler(req, res) {
  // get dynamic route parameter
  const { id } = req.query;

  const { data, error } = await supabaseClient
    .from("user")
    .select()
    .eq("id", id);

  if (error) {
    console.error(`error: ${JSON.stringify(error)}`);
    return res.status(500).json({ data: null, error: error });
  }

  console.log(`dummy: get user.`);
  console.log(data)
  res.status(200).json({ data: data[0], error: null });
}
