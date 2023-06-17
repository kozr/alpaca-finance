import supabaseClient from '../../supabase/backend';

// WARNING: no rollback logic for failed payments

interface ExecuteTransactionProps {
  transactionId: number;
}

// execute transaction by calling executePayment on each payment asscociated with the transaction that is in "pending" state
// then if all payments are successful, update transaction state to "successful"
const executeTransaction = async ({ transactionId }: ExecuteTransactionProps) => {
  const { error } = await supabaseClient.rpc('execute_transaction', { p_transaction_id: transactionId });

  if (error) {
    console.log("Error executing transaction: ", error);
    return {
      error: error,
    };
  }

  return {
    error: null
  }
}

export default executeTransaction;
