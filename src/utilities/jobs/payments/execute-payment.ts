import supabaseClient from '../../supabase/backend';

interface ExecutePaymentProps {
  payment_id: number;
}

// transfer balance from payer to payee from user table's "balance"
// update payment state to "paid"
const executePayment = async ({
  payment_id,
}: ExecutePaymentProps) => {
  const { data: paymentData, error: paymentError } = await supabaseClient.from("payment").select("*").eq("id", payment_id);
  if (paymentError) {
    console.log("Error getting payment: ", paymentError);
    return;
  }

  const payer_id = paymentData[0].payer_user_id;
  const payee_id = paymentData[0].payee_user_id;
  const amount = paymentData[0].amount;

  const { data: payerData, error: payerError } = await supabaseClient.from("user").select("balance").eq("id", payer_id);
  if (payerError) {
    console.log("Error getting payer's balance: ", payerError);
    return;
  }
  const { data: payeeData, error: payeeError } = await supabaseClient.from("user").select("balance").eq("id", payee_id);
  if (payeeError) {
    console.log("Error getting payee's balance: ", payeeError);
    return;
  }

  // update payer's balance
  const payerBalance = payerData[0].balance;
  const newPayerBalance = payerBalance - amount;
  const { data: updatedPayerData, error: updatedPayerError } = await supabaseClient.from("user").update({
    balance: newPayerBalance,
  }).eq("id", payer_id);
  if (updatedPayerError) {
    console.log("Error updating payer's balance: ", updatedPayerError);
    return;
  }

  // update payee's balance
  const payeeBalance = payeeData[0].balance;
  const newPayeeBalance = payeeBalance + amount;
  const { data: updatedPayeeData, error: updatedPayeeError } = await supabaseClient.from("user").update({
    balance: newPayeeBalance,
  }).eq("id", payee_id);
  if (updatedPayeeError) {
    console.log("Error updating payee's balance: ", updatedPayeeError);
    return;
  }

  // update payment state to "paid"
  await supabaseClient.from("payment").update({
    state: "paid",
  }).eq("payer_user_id", payer_id).eq("payee_user_id", payee_id).eq("amount", amount);
};

export default executePayment;