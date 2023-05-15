import supabase from "@/utilities/supabase/backend";

interface AttemptConfirmTransaction {
  transactionId: number;
}

// If all payments are successful, then update transaction to be successful
const attemptConfirmTransaction = async ({
  transactionId,
}: AttemptConfirmTransaction) => {
  const { data: pendingPayments, error: pendingPaymentsError } = await supabase
    .from("payment")
    .select()
    .eq("transaction_id", transactionId)
    .eq("state", "pending");

  if (pendingPaymentsError) {
    console.log("attemptConfirmTransaction error getting pending payments.");
    return;
  }

  if (pendingPayments.length) {
    return;
  }

  // update transaction state to "successful"
  await supabase
    .from("transaction")
    .update({
      state: "successful",
    })
    .eq("id", transactionId);
};

export default attemptConfirmTransaction;
