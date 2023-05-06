// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import supabase from "@/utilities/supabase/backend";
import { sendCancelledPaymentNotice, sendRejectedPaymentNotice } from "@/utilities/bullmq";

// Can be optimized where update returns the updated row
export default async function handler(req, res) {
  const { cancel_token } = req.query;

  if (!cancel_token) {
    const errorMessage = `reject-payment: No cancel_token provided.`;
    console.error(errorMessage);
    return res.status(400).json({ data: null, error: errorMessage });
  }

  const { data, error } = await supabase
    .from("payment")
    .select()
    .eq("cancel_token", cancel_token)
    .eq("state", "pending");

  if (error) {
    console.error(`reject-payment error: ${JSON.stringify(error)}`);
    return res.status(500).json({ error: error });
  }

  if (data.length == 0) {
    let errorMessage = `Cannot find pending payment with cancel_token: ${cancel_token}`;
    // see if payment was successful
    const { data: searchData, error: searchError } = await supabase
      .from("payment")
      .select()
      .eq("cancel_token", cancel_token);

    if (searchError) {
      console.error(`searchError: ${JSON.stringify(searchError)}`);
      return res.status(500).json({ error: searchError });
    }

    if (searchData.length > 0) {
      const { state } = searchData[0];
      if (state == "successful") {
        errorMessage = `Payment already went through.`;
      } else if (state == "rejected") {
        errorMessage = `Payment was already rejected.`;
      }
      console.error(errorMessage);

      return res.status(400).json({ data: null, error: errorMessage });
    }

    console.error(errorMessage);
    return res.status(404).json({ data: null, error: errorMessage });
  }

  // update payment state to cancelled
  const { data: updatedData, error: updateError } = await supabase
    .from("payment")
    .update({ state: "rejected" })
    .eq("cancel_token", cancel_token)
    .eq("state", "pending")
    .select();

  console.log(updateError, updatedData);
  if (updateError) {
    console.error(`reject-payment update error: ${JSON.stringify(updateError)}`);
    return res.status(500).json({ error: updateError });
  }

  // call sendCancelledPaymentNotice(updatedData[0].id) in the next line to send email to payee in the background with bullmq
  const { isSuccessful, error: emailError } = await sendCancelledPaymentNotice(updatedData[0].id);
  if (!isSuccessful) {
    console.error(`reject-payment sendCancelledPaymentNotice: ${JSON.stringify(emailError)}`);
  }

  // use sendRejectedPaymentNotice to send email to payer
  const { isSuccessful2, error: emailError2 } = await sendRejectedPaymentNotice(updatedData[0].id);
  if (!isSuccessful2) {
    console.error(`reject-payment sendRejectedPaymentNotice: ${JSON.stringify(emailError2)}`);
  }

  console.log(`Successfully cancelled payment: ${cancel_token}`);

  res.status(200).json(true);
}
