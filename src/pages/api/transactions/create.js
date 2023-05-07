import supabaseClient from "@/utilities/supabase/backend";
import {
  executeTransaction,
  sendPaymentRequestedNotice,
} from "@/utilities/bullmq";
import authMiddleware from "@/utilities/auth-middleware";

const handleTransactionIssue = async (transactionId, error) => {
  await supabaseClient
    .from("transaction")
    .update({ state: "failed", failure_reason: error })
    .match({ id: transactionId });
  throw new Error(error);
};

async function handler(req, res) {
  try {
    const body = req.body;
    const payee = body["payee"];
    const type = body["type"];
    const paymentRequests = body["paymentRequests"];

    if (type !== "request") {
      throw new Error("Transaction type for now must be request");
    }

    if (req.user.id !== payee.id) {
      const errorMessage = "Payee must be the same as the user making the request";
      console.log(errorMessage)
      throw new Error(errorMessage);
    }

    const transactionRes = await supabaseClient
      .from("transaction")
      .insert({
        requester_user_id: payee.id,
        type: type,
        state: "pending",
      })
      .select("id");

    if (transactionRes["error"]) throw new Error(transactionRes["error"]);

    const transactionId = transactionRes["data"][0]["id"];
    const associatedPayments = paymentRequests.map(({ user, amount }) => {
      return {
        payee_user_id: payee.id,
        payer_user_id: user.id,
        transaction_id: transactionId,
        amount: amount,
        state: "pending",
        currency: "CAD",
      };
    });

    const paymentRes = await supabaseClient
      .from("payment")
      .insert(associatedPayments)
      .select();

    if (paymentRes["error"])
      await handleTransactionIssue(transactionId, paymentRes["error"]);

    const total = paymentRes["data"].reduce(
      (acc, curr) => acc + curr["amount"],
      0
    );

    const expectedTotal = paymentRequests.reduce(
      (acc, curr) => acc + curr["amount"],
      0
    );

    if (total !== expectedTotal) {
      await handleTransactionIssue(
        transactionId,
        `total: ${total} !== expectedTotal: ${expectedTotal}`
      );
    }

    // set transaction to execute after 2 days
    const milisecondsInADay = 24 * 60 * 60 * 1000;
    const { isSuccessful: success, error: jobError } = await executeTransaction(transactionId, 0);
    if (!success) {
      await handleTransactionIssue(transactionId, jobError);
    } else {
      console.log(`Transaction ${transactionId} scheduled to execute in 2 days`)
    }

    // call job to send emails to each payer with payment id
    for (const payment of paymentRes["data"]) {
      const { isSuccessful: success2, error: jobError2 } = await sendPaymentRequestedNotice(payment["id"]);
      if (!success2) {
        await handleTransactionIssue(transactionId, jobError2);
      }
    }

    res.status(200).json({ total });
  } catch (error) {
    console.error(`Transaction create error: ${error}`);
    return res.status(500).json({ error: error });
  }
}

export default authMiddleware(handler);