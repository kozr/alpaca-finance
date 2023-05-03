import supabaseClient from '../../supabase/backend';

// WARNING: no rollback logic for failed payments

interface ExecuteTransactionProps {
  transaction_id: number;
}

// execute transaction by calling executePayment on each payment asscociated with the transaction that is in "pending" state
// then if all payments are successful, update transaction state to "paid"
const executeTransaction = async ({ transaction_id }: ExecuteTransactionProps) => {
  const { data: paymentsData, error: paymentsError } = await supabaseClient.from("payments").select("*").eq("transaction_id", transaction_id).eq("state", "pending");
  if (paymentsError) {
    console.log("Error getting payments: ", paymentsError);
    return;
  }

  for (const payment of paymentsData) {
    await executePayment({
      payer_id: payment.payer_user_id.toString(),
      payee_id: payment.payee_user_id.toString(),
      amount: payment.amount,
    });
  }

  // update transaction state to "paid"
  await supabaseClient.from("transactions").update({
    state: "paid",
  }).eq("id", transaction_id);
}

interface ExecutePaymentProps {
  payer_id: string;
  payee_id: string;
  amount: number;
}

// transfer balance from payer to payee from user table's "balance"
// update payment state to "paid"
const executePayment = async ({
  payer_id,
  payee_id,
  amount,
}: ExecutePaymentProps) => {
  const { data: payerData, error: payerError } = await supabaseClient.from("users").select("balance").eq("id", payer_id);
  if (payerError) {
    console.log("Error getting payer's balance: ", payerError);
    return;
  }
  const { data: payeeData, error: payeeError } = await supabaseClient.from("users").select("balance").eq("id", payee_id);
  if (payeeError) {
    console.log("Error getting payee's balance: ", payeeError);
    return;
  }

  // update payer's balance
  const payerBalance = payerData[0].balance;
  const newPayerBalance = payerBalance - amount;
  const { data: updatedPayerData, error: updatedPayerError } = await supabaseClient.from("users").update({
    balance: newPayerBalance,
  }).eq("id", payer_id);
  if (updatedPayerError) {
    console.log("Error updating payer's balance: ", updatedPayerError);
    return;
  }

  // update payee's balance
  const payeeBalance = payeeData[0].balance;
  const newPayeeBalance = payeeBalance + amount;
  const { data: updatedPayeeData, error: updatedPayeeError } = await supabaseClient.from("users").update({
    balance: newPayeeBalance,
  }).eq("id", payee_id);
  if (updatedPayeeError) {
    console.log("Error updating payee's balance: ", updatedPayeeError);
    return;
  }

  // update payment state to "paid"
  await supabaseClient.from("payments").update({
    state: "paid",
  }).eq("payer_user_id", payer_id).eq("payee_user_id", payee_id).eq("amount", amount);
};

export default executePayment;
