import supabaseClient from "@/utilities/supabase/backend";
import {
  executeTransaction,
} from "@/utilities/bullmq";
import sendPaymentRequestedNotice from '@/utilities/jobs/emails/payments/send-payment-requested-notice';
import authMiddleware from "@/utilities/auth-middleware";
import sendWithdrawDepositNotice from '@/utilities/jobs/emails/payments/send-deposit-and withdrawal-notice'; 

const handleTransactionIssue = async (transactionId, error) => {
  await supabaseClient
    .from("transaction")
    .update({ state: "failed", failure_reason: error })
    .match({ id: transactionId });
  throw new Error(error);
};

const SUPPORTED_TRANSACTION_TYPES = ["request", "withdrawal", "deposit"];

async function handleTransaction(type, amount, userId) {
    const transactionRes = await supabaseClient
        .from("transaction")
        .insert({
            user_id: userId,
            type: type,
            state: "completed",
            total_amount: amount
        })
        .select("id, total_amount");

    if (transactionRes.error) throw new Error(transactionRes.error.message);

    const userRes = await supabaseClient
        .from("user")
        .select("balance")
        .eq("id", userId)
        .single();

    if (userRes.error) {
        throw new Error(userRes.error.message);
    }

    return userRes.data.balance;
}

async function updateBalance(userId, newBalance) {
    const updateRes = await supabaseClient
        .from("user")
        .update({ balance: newBalance })
        .eq("id", userId);

    if (updateRes.error) {
        throw new Error(updateRes.error.message);
    }
}

async function sendNotification(userId, amount, type) {
    const result = await sendWithdrawDepositNotice({
        userId: userId,
        amount: amount,
        transactionType: type
    });
    console.log('sendWithdrawDepositNotice result:', result);

    if (result && result.error) throw new Error(result.error.message);
}


async function handler(req, res) {

  try {
    const body = req.body;
    const payee = body["payee"];
    const type = body["type"];

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
            const currentBalanceWithdrawal = await handleTransaction(type, withdrawalAmount, req.user.id);
            const newBalanceWithdrawal = currentBalanceWithdrawal - withdrawalAmount;
            await updateBalance(req.user.id, newBalanceWithdrawal);
            await sendNotification(req.user.id, withdrawalAmount, type);
            return res.status(200).json({ newBalance: newBalanceWithdrawal });


      case "deposit":
            // Handle deposit transaction
            const depositAmount = body["amount"];
            const currentBalanceDeposit = await handleTransaction(type, depositAmount, req.user.id);
            const newBalanceDeposit = currentBalanceDeposit + Number(depositAmount);
            await updateBalance(req.user.id, newBalanceDeposit);
            await sendNotification(req.user.id, depositAmount, type);
            return res.status(200).json({ newBalance: newBalanceDeposit });

      default:
        throw new Error("Unsupported transaction type");
    }

    
  } catch (error) {
    console.error(`Transaction create error: ${error}`);
    return res.status(500).json({ error: error });
  }
}

export default authMiddleware(handler);