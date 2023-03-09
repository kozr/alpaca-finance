// WIP

import supabaseClient from "@/utilities/supabase/backend";

export default async function handler(req, res) {
  const { data, error } = await supabaseClient.from("test").select();

  if (error) {
    console.error(`error: ${JSON.stringify(error)}`);
    return res.status(500).json({ error: error });
  }

  console.log(`dummy: created user.`);
  res.status(200).json({ data: data });
}
