import authMiddleware from "@/utilities/auth-middleware";
import executePayment from "@/utilities/jobs/payments/execute-payment";
import supabase from "@/utilities/supabase/backend";

async function handler(req, res) {
  const paymentId = req.query.id;
  
  const { data: payment, error: paymentError } = await supabase
    .from("payment")
    .select("*")
    .eq('id', paymentId)
    .eq('payer_user_id', req.user.id)
    .single();

  if (paymentError) {
    console.log("paymentError: ", paymentError)
    return res.status(500).json({ paymentError });
  }

  // There is a case where the payment does not belong to the user so it was not found
  // that case is sliently handled.
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }

  console.log("payment: ", payment.id)

  const { error: executionError } = await executePayment({
    payment_id: payment.id,
  });
  if (executionError) {
    console.log("executionError: ", executionError)
    return res.status(500).json({ executionError });
  }

  return res.status(200).json({ message: "Payment approved" });
}

export default authMiddleware(handler);
