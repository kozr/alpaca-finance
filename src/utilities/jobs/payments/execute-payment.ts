import supabaseClient from "@/utilities/supabase/backend";
import { attemptConfirmTransaction } from "@/utilities/bullmq";

interface ExecutePaymentProps {
  payment_id: number;
}

// transfer balance from payer to payee from user table's "balance"
// update payment state to "successful"
const executePayment = async ({ payment_id }: ExecutePaymentProps) => {
  const { data, error } = await supabaseClient.rpc('execute_payment', { payment_id });

  if (error) {
    console.log("Error executing payment: ", error);
    return {
      error: error,
    };
  }

  const transactionId = data;
  await attemptConfirmTransaction(transactionId);

  return {
    error: null
  }
};

export default executePayment;
