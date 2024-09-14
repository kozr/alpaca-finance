import authMiddleware from "@/utilities/auth-middleware";
import executePayment from "@/utilities/jobs/payments/execute-payment";
import supabase from "@/utilities/supabase/backend";

async function handler(req, res) {
  const paymentId = req.query.id;

  // Atomically update the payment state to 'processing' if it's currently 'pending'
  const { data: payment, error: updateError } = await supabase
    .from("payment")
    .update({ state: 'processing' })
    .eq('id', paymentId)
    .eq('payer_user_id', req.user.id)
    .eq('state', 'pending') // Only update if state is 'pending'
    .select('*') // Retrieve the updated row
    .single();

  if (updateError) {
    console.log("updateError: ", updateError);
    return res.status(500).json({ error: updateError.message });
  }

  // If no payment was updated, it means it's not found or already processed
  if (!payment) {
    return res.status(404).json({ error: "Payment not found or already processed" });
  }

  console.log("Processing payment: ", payment.id);

  // Proceed to execute the payment
  const { error: executionError } = await executePayment({
    payment_id: payment.id,
  });

  if (executionError) {
    console.log("executionError: ", executionError);
    // Update the payment state to 'failed'
    await supabase
      .from('payment')
      .update({ state: 'failed' })
      .eq('id', payment.id);
    return res.status(500).json({ error: executionError.message });
  }

  // Update payment state to 'completed'
  const { error: finalizeError } = await supabase
    .from('payment')
    .update({ state: 'successful' })
    .eq('id', payment.id);

  if (finalizeError) {
    console.log("finalizeError: ", finalizeError);
    return res.status(500).json({ error: finalizeError.message });
  }

  return res.status(200).json({ message: "Payment approved" });
}

export default authMiddleware(handler);
