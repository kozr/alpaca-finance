import supabase from "@/utilities/supabase/backend";

async function handler(req, res) {
  const { data, error } = await supabase.from("payment").select("*")

  const totalVolume = data.reduce((acc, curr) => acc + curr.amount, 0);

  console.log(totalVolume)
  res.status(200).json({ data: totalVolume });
}

export default handler;
