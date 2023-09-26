import supabaseClient from "@/utilities/supabase/backend"
import transactionDetailsSerializer from "@/serializers/transactions/transaction-details-serializer"

export default async function handler(req, res) {

  const userId = req.query.userId;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  if (!userId || !startDate || !endDate) {
    return res.status(400).json({ error: "userId, startDate, and endDate are required" });
  }

  const { data, error } = await supabaseClient
    .from("transaction")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", startDate) // Assuming your date column is named "created_at"
    .lte("created_at", endDate);
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