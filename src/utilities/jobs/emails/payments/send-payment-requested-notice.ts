import { sendEmail } from "@/utilities/nodemailer";
import supabase from "@/utilities/supabase/backend";

interface SendPaymentRequestedNotice {
  paymentId: number;
}

const sendPaymentRequestedNotice = async ({
  paymentId,
}: SendPaymentRequestedNotice) => {
  const daysToCancel = 2;

  const { data: paymentData, error: paymentError } = await supabase
    .from("payment")
    .select("*")
    .eq("id", paymentId)
    .single()
  if (paymentError) {
    console.log(
      "SendPaymentRequestedNotice: Error getting payment: ",
      paymentError
    );
    return {
      error: paymentError,
    }
  }

  // the payment table has payer_user_id and payee_user_id and also the amountOwed
  const payerUserId = paymentData.payer_user_id;
  const payeeUserId = paymentData.payee_user_id;
  const amountOwed = paymentData.amount;
  const cancelToken = paymentData.cancel_token;
  const reason = paymentData.reason

  // get payer's email
  const { data: payerData, error: payerError } = await supabase
    .from("user")
    .select("email")
    .eq("id", payerUserId)
    .single();
  if (payerError) {
    console.log(
      "SendPaymentRequestedNotice: Error getting payer's email: ",
      payerError
    );
    return {
      error: payerError,
    }
  }

  console.warn(payerData);

  const payerEmail = payerData.email;

  // get payee's name
  const { data: payeeData, error: payeeError } = await supabase
    .from("user")
    .select("first_name, last_name")
    .eq("id", payeeUserId)
    .single();
  if (payeeError) {
    console.log(
      "SendPaymentRequestedNotice: Error getting payee's name: ",
      payeeError
    );
    return {
      error: payeeError,
    };
  }

  const payeeName = `${payeeData.first_name} ${payeeData.last_name}`;

  await sendEmail({
    to: payerEmail,
    subject: `NOTICE: You have been requested to reimburse $${amountOwed} to ${payeeName}.`,
    html: `
      <h1>Payment Request</h1>
      <p>
        You have been requested to reimburse <strong>$${amountOwed}</strong> to <strong>${payeeName} for "${reason}"</strong>.
      </p>
      <p>
        You have <strong>${daysToCancel} days</strong> to decline this request, otherwise it will be automatically accepted.
      </p>
      <p>
        Please click the following link to decline if this is a mistake: <a href="${process.env.PROD_URL}/reject-payment/${cancelToken}">Decline Payment Request</a>.
      </p>
    `,
  });

  console.log("SendPaymentRequestedNotice: email sent to " + payerEmail);

  return {
    error: null,
  }
};

export default sendPaymentRequestedNotice;
