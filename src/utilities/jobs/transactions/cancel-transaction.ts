import supabaseClient from '../../supabase/backend';

// WARNING: no rollback logic for failed payments

interface CancelTransactionProps {
  transaction_id: number;
  reason: string;
}

// Cancel transaction by calling CancelPayment on each payment asscociated with the transaction that is in "pending" state
// then if all payments are successfully cancelled, update transaction state to "cancelled" and add reason
const cancelTransaction = async ({ transaction_id, reason }: CancelTransactionProps) => {
  const { data: paymentsData, error: paymentsError } = await supabaseClient.from("payments").select("*").eq("transaction_id", transaction_id).eq("state", "pending");
  if (paymentsError) {
    console.log("Error getting payments: ", paymentsError);
    return;
  }

  for (const payment of paymentsData) {
    await cancelPayment({
      payment_id: payment.id.toString(),
    });
  }

  // update transaction state to "cancelled"
  await supabaseClient.from("transactions").update({
    state: "cancelled",
    failure_reason: reason,
  }).eq("id", transaction_id);
}

interface CancelPaymentProps {
  payment_id: string;
}

// update payment state to "cancelled"
const cancelPayment = async ({
  payment_id,
}: CancelPaymentProps) => {
  const { data: paymentData, error: paymentError } = await supabaseClient.from("payments").select("*").eq("id", payment_id);
  if (paymentError) {
    console.log("Error getting payment: ", paymentError);
    return;
  }

  const { data: updatedPaymentData, error: updatedPaymentError } = await supabaseClient.from("payments").update({
    state: "cancelled",
  }).eq("id", payment_id);
  if (updatedPaymentError) {
    console.log("Error updating payment: ", updatedPaymentError);
    return;
  }
};

export default cancelPayment;
