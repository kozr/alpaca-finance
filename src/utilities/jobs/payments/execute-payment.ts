import supabaseClient from "@/utilities/supabase/backend";
import { attemptConfirmTransaction } from "@/utilities/bullmq";

interface ExecutePaymentProps {
  payment_id: number;
}

// transfer balance from payer to payee from user table's "balance"
// update payment state to "successful"
const executePayment = async ({ payment_id }: ExecutePaymentProps) => {
  const { data: paymentData, error: paymentError } = await supabaseClient
    .from("payment")
    .select("*")
    .eq("id", payment_id)
    .single();

  if (paymentError) {
    console.log("Error getting payment: ", paymentError);
    return;
  }

  const payer_id = paymentData.payer_user_id;
  const payee_id = paymentData.payee_user_id;
  const amount = paymentData.amount;

  const { data: payerData, error: payerError } = await supabaseClient
    .from("user")
    .select("balance")
    .eq("id", payer_id)
    .single();
  if (payerError) {
    console.log("Error getting payer's balance: ", payerError);
    return;
  }
  const { data: payeeData, error: payeeError } = await supabaseClient
    .from("user")
    .select("balance")
    .eq("id", payee_id)
    .single();
  if (payeeError) {
    console.log("Error getting payee's balance: ", payeeError);
    return;
  }

  // update payer's balance
  const payerBalance = payerData.balance;
  const newPayerBalance = payerBalance - amount;
  const { data: _updatedPayerData, error: updatedPayerError } =
    await supabaseClient
      .from("user")
      .update({
        balance: newPayerBalance,
      })
      .eq("id", payer_id);
  if (updatedPayerError) {
    console.log("Error updating payer's balance: ", updatedPayerError);
    return;
  }

  // update payee's balance
  const payeeBalance = payeeData.balance;
  const newPayeeBalance = payeeBalance + amount;
  const { data: _updatedPayeeData, error: updatedPayeeError } =
    await supabaseClient
      .from("user")
      .update({
        balance: newPayeeBalance,
      })
      .eq("id", payee_id);
  if (updatedPayeeError) {
    console.log("Error updating payee's balance: ", updatedPayeeError);
    return;
  }

  // update payment state to "successful"
  await supabaseClient
    .from("payment")
    .update({
      state: "successful",
    })
    .eq("payer_user_id", payer_id)
    .eq("payee_user_id", payee_id)
    .eq("amount", amount);

  await attemptConfirmTransaction(paymentData.transaction_id);
};

export default executePayment;
