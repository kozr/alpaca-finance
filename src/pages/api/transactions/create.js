import supabaseClient from "@/utilities/supabase/backend";
import { sendPaymentRequestedNotice } from '@/utilities/bullmq'

const handlePaymentError = async (transactionId, error) => {
  console.error(`error: ${JSON.stringify(error)}`);
  await supabaseClient.from("transaction").update({ state: "failed", failure_reason: "unknown payment issue" }).match({ id: transactionId });
  throw new Error(error);
}

export default async function handler(req, res) {
  console.log(req.body)
  try {
    const body = JSON.parse(req.body)
    const payee = body["payee"]
    const type = body["type"]
    const paymentRequests = body["paymentRequests"]

    if (type !== "request") {
      throw new Error("Transaction type must be request")
    }

    const transactionRes = await supabaseClient.from("transaction").insert({
      requester_user_id: payee.id,
      type: type,
      state: "pending",
    }).select("id");

    if (transactionRes["error"]) throw new Error(transactionRes["error"]);

    const transactionId = transactionRes["data"][0]['id'];
    const associatedPayments = paymentRequests.map(({ user, amount }) => {
      return {
        payee_user_id: payee.id,
        payer_user_id: user.id,
        transaction_id: transactionId,
        amount: amount,
        state: 'pending',
        currency: 'CAD',
      }
    });
    const paymentRes = await supabaseClient.from("payment").insert(associatedPayments).select();
  
    if (paymentRes["error"]) await handlePaymentError(transactionId, paymentRes["error"]);

    const total = paymentRes["data"].reduce((acc, curr) => acc + curr["amount"], 0);

    const expectedTotal = paymentRequests.reduce((acc, curr) => acc + curr["amount"], 0);

    if (total !== expectedTotal) {
      await handlePaymentError(transactionId, `total: ${total} !== expectedTotal: ${expectedTotal}`);
    }

    // call job to send emails to each payer with payment id
    for (const payment of paymentRes["data"]) {
      console.log(payment['id'])
      await sendPaymentRequestedNotice(payment['id'])
    }

    res.status(200).json({ total });
  } catch (error) {
    console.error(`error: ${error}`);
    return res.status(500).json({ error: error });
  }
}
