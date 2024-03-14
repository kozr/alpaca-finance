import supabaseClient from "@/utilities/supabase/backend";
import {
  executeTransaction,
} from "@/utilities/bullmq";
import sendPaymentRequestedNotice from '@/utilities/jobs/emails/payments/send-payment-requested-notice'
import authMiddleware from "@/utilities/auth-middleware";

const handleTransactionIssue = async (transactionId, error) => {
  await supabaseClient
    .from("transaction")
    .update({ state: "failed", failure_reason: error })
    .match({ id: transactionId });
  throw new Error(error);
};

async function handler(req, res) {

    const SUPPORTED_TRANSACTION_TYPES = ["request", "withdrawal", "deposit"];

  try {
    const body = req.body;
    const payee = body["payee"];
    const type = body["type"];
    

    /*if (!SUPPORTED_TRANSACTION_TYPES.includes(type)) {
      throw new Error("Unsupported transaction type");
    }*/

    switch (type) {
      case "request":
            // Handle request transaction
            const paymentRequests = body["paymentRequests"];

            if (req.user.id !== payee.id) {
                const errorMessage = "Payee must be the same as the user making the request";
                console.log(errorMessage)
                throw new Error(errorMessage);
            }

            const expectedTotal = paymentRequests.reduce(
                (acc, curr) => acc + curr["amount"],
                0
            );

            const transactionRes = await supabaseClient
                .from("transaction")
                .insert({
                    user_id: payee.id,
                    type: type,
                    state: "pending",
                    total_amount: expectedTotal
                })
                .select("id, total_amount");

            if (transactionRes["error"]) throw new Error(transactionRes["error"]);

            const transactionId = transactionRes["data"][0]["id"];
            const associatedPayments = paymentRequests.map(({ user, amount, reason }) => {
                return {
                    payee_user_id: payee.id,
                    payer_user_id: user.id,
                    transaction_id: transactionId,
                    amount: amount,
                    state: "pending",
                    currency: "CAD",
                    reason: reason,
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

            if (total !== expectedTotal) {
                await handleTransactionIssue(
                    transactionId,
                    `total: ${total} !== expectedTotal: ${expectedTotal}`
                );
            }

            // set transaction to execute after 2 days
            const milisecondsInADay = 24 * 60 * 60 * 1000;
            const { error: jobError } = await executeTransaction(transactionId, 2 * milisecondsInADay);
            if (jobError) {
                await handleTransactionIssue(transactionId, jobError);
            } else {
                console.log(`Transaction ${transactionId} scheduled to execute in 2 days`)
            }

            // call job to send emails to each payer with payment id
            for (const payment of paymentRes["data"]) {
                const { error: transactionMailer } = await sendPaymentRequestedNotice({ paymentId: payment["id"] });
                if (transactionMailer) {
                    await handleTransactionIssue(transactionId, transactionMailer);
                }
            }


            return res.status(200).json({ total });

      case "withdrawal":
            // Handle withdrawal transaction
            const withdrawalAmount = body["amount"];

            const transactioRes = await supabaseClient
                .from("transaction")
                .insert({
                    user_id: req.user.id, 
                    type: type,
                    state: "completed", 
                    total_amount: withdrawalAmount
                })
                .select("id, total_amount");

            if (transactioRes["error"]) throw new Error(transactioRes["error"].message);


            const userRes = await supabaseClient
                .from("user")
                .select("balance")
                .eq("id", req.user.id)
                .single(); // Assuming 'id' is unique, '.single()' ensures you get one record only

            if (userRes.error) {
                throw new Error(userRes.error.message);
            }

            const currentBalance = userRes.data.balance;

            const newBalance = currentBalance - withdrawalAmount;

            // 3. Update the user's balance in the 'user' table
            const updateRes = await supabaseClient
                .from("user")
                .update({ balance: newBalance })
                .eq("id", req.user.id);

            if (updateRes.error) {
                throw new Error(updateRes.error.message);
            }


            return res.status(200).json({ newBalance });


      case "deposit":
        // Handle deposit transaction
        break;
      default:
        throw new Error("Unsupported transaction type");
    }

    
  } catch (error) {
    console.error(`Transaction create error: ${error}`);
    return res.status(500).json({ error: error });
  }
}

export default authMiddleware(handler);