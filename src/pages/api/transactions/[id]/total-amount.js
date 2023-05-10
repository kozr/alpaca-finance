// import supabaseClient from "@/utilities/supabase/backend"

// need to figure out a way to get the total amount of a transaction

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     res.setHeader("Allow", ["GET"])
//     return res.status(405).end(`Method ${req.method} Not Allowed`)
//   }

//   const { id } = req.query
//   const { data, error } = await supabaseClient
//     .from("payments")
//     .select("*")
//     .eq("id", id)

//   if (error) {
//     return res.status(500).json({ error })
//   }
  

// }