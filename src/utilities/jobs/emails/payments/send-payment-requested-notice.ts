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
    .eq("id", paymentId);
  if (paymentError) {
    console.log(
      "SendPaymentRequestedNotice: Error getting payment: ",
      paymentError
    );
    return;
  }

  // the payment table has payer_user_id and payee_user_id and also the amountOwed
  const payerUserId = paymentData[0].payer_user_id;
  const payeeUserId = paymentData[0].payee_user_id;
  const amountOwed = paymentData[0].amount;
  const cancelToken = paymentData[0].cancel_token;

  // get payer's email
  const { data: payerData, error: payerError } = await supabase
    .from("user")
    .select("email")
    .eq("id", payerUserId);
  if (payerError) {
    console.log(
      "SendPaymentRequestedNotice: Error getting payer's email: ",
      payerError
    );
    return;
  }

  console.warn(payerData);

  const payerEmail = payerData[0].email;

  // get payee's name
  const { data: payeeData, error: payeeError } = await supabase
    .from("user")
    .select("first_name, last_name")
    .eq("id", payeeUserId);
  if (payeeError) {
    console.log(
      "SendPaymentRequestedNotice: Error getting payee's name: ",
      payeeError
    );
    return;
  }

  console.warn(payeeData);

  const payeeName = `${payeeData[0].first_name} ${payeeData[0].last_name}`;

  console.log("SendPaymentRequestedNotice: email sent to " + payerEmail);

  sendEmail({
    to: payerEmail,
    subject: `NOTICE: You have been requested to reimburse $${amountOwed} to ${payeeName}.`,
    html: `
      <h1>Payment Request</h1>
      <p>
        You have been requested to reimburse <strong>$${amountOwed}</strong> to <strong>${payeeName}</strong>.
      </p>
      <p>
        You have <strong>${daysToCancel} days</strong> to decline this request, otherwise it will be automatically accepted.
      </p>
      <p>
        Please click the following link to decline if this is a mistake: <a href="http://localhost:3000/api/reject-payment/${cancelToken}">Decline Payment Request</a>.
      </p>
    `,
  });
};

export default sendPaymentRequestedNotice;
