import { sendEmail } from "@/utilities/nodemailer";
import supabase from "@/utilities/supabase/backend";

interface SendCancelledPaymentNoticeProps {
  paymentId: number;
}

const sendCancelledPaymentNotice = async ({
  paymentId
}: SendCancelledPaymentNoticeProps) => {
  const { data: paymentData, error: paymentError } = await supabase.from("payment").select("*").eq("id", paymentId);
  if (paymentError) {
    console.log("SendCancelledPaymentNoticeProps: Error getting payment: ", paymentError);
    return;
  }

  // the payment table has payer_user_id and payee_user_id and also the amountOwed
  const payerUserId = paymentData[0].payer_user_id;
  const payeeUserId = paymentData[0].payee_user_id;
  const amountOwed = paymentData[0].amount;

  // get payer's email
  const { data: payerData, error: payerError } = await supabase.from("user").select("email").eq("id", payerUserId);
  if (payerError) {
    console.log("SendCancelledPaymentNoticeProps: Error getting payer's email: ", payerError);
    return;
  }
  const payerEmail = payerData[0].email;

  // get payee's name
  const { data: payeeData, error: payeeError } = await supabase.from("user").select("first_name, last_name").eq("id", payeeUserId);
  if (payeeError) {
    console.log("SendCancelledPaymentNoticeProps: Error getting payee's name: ", payeeError);
    return;
  }
  const payeeName = `${payeeData[0].first_name} ${payeeData[0].last_name}`;

  console.log("SendCancelledPaymentNoticeProps: email sent to " + payerEmail)

  sendEmail({
    to: payerEmail,
    subject: `NOTICE: Request to reimburse $${amountOwed} to ${payeeName} has been successfully cancelled.`,
    html: `
      <h1>Cancelled Payment Request</h1>
      <p>
        The request to reimburse <strong>$${amountOwed}</strong> to <strong>${payeeName}</strong> has been cancelled.
      </p>
      <p>There is no further action required on your part.</p>
    `,
  });
};

export default sendCancelledPaymentNotice;
