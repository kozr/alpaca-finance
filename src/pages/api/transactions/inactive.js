import supabaseClient from "@/utilities/supabase/backend"
import transactionDetailsSerializer from "@/serializers/transactions/transaction-details-serializer"

export default async function handler(req, res) {

  const userId = req.query.userId; // Get userId from the query parameters

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const { data, error } = await supabaseClient
    .from("transaction")
    .select("*")
    .eq("state", "successful")
    .eq("user_id", userId);
  if (error) {
    return res.status(500).json({ error })
  }

  const promises = data.map(async (transaction) => {
    const { data: user, error: userError } = await supabaseClient
      .from("user")
      .select("*")
      .eq("id", transaction.user_id)
      .single()

    if (userError) {
      return res.status(500).json({ userError })
    }

    return transactionDetailsSerializer(transaction, user)
  })

  const transactionDetails = await Promise.all(promises)
  
  return res.status(200).json({ data: transactionDetails })
}