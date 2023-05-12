import supabaseClient from '../../supabase/backend';
import executePayment from '../payments/execute-payment';

// WARNING: no rollback logic for failed payments

interface ExecuteTransactionProps {
  transactionId: number;
}

// execute transaction by calling executePayment on each payment asscociated with the transaction that is in "pending" state
// then if all payments are successful, update transaction state to "paid"
const executeTransaction = async ({ transactionId }: ExecuteTransactionProps) => {
  console.log(`executeTransaction: transactionId: ${transactionId}`)
  const { data: paymentsData, error: paymentsError } = await supabaseClient.from("payment").select("*").eq("transaction_id", transactionId).eq("state", "pending");
  if (paymentsError) {
    console.log("executeTransaction error getting payments: ", paymentsError);
    return;
  }

  for (const payment of paymentsData) {
    await executePayment({
      payment_id: payment.id,
    });
  }

  // update transaction state to "paid"
  await supabaseClient.from("transaction").update({
    state: "paid",
  }).eq("id", transactionId);
}

export default executeTransaction;
