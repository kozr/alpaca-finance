import { sendEmail } from "@/utilities/nodemailer";
import supabase from "@/utilities/supabase/backend";

interface SendCancelledTransactionNoticeProps {
  paymentId: number;
}

const sendCancelledTransactionNotice = async ({
  paymentId
}: SendCancelledTransactionNoticeProps) => {
  const { data: paymentData, error: paymentError } = await supabase.from("payment").select("*").eq("id", paymentId);
  if (paymentError) {
    console.log("SendCancelledTransactionNoticeProps: Error getting payment: ", paymentError);
    return;
  }

  // the payment table has payer_user_id and payee_user_id and also the amountOwed
  const payerUserId = paymentData[0].payer_user_id;
  const payeeUserId = paymentData[0].payee_user_id;
  const amountOwed = paymentData[0].amount;

  // get payer's email
  const { data: payerData, error: payerError } = await supabase.from("user").select("email").eq("id", payerUserId);
  if (payerError) {
    console.log("SendCancelledTransactionNoticeProps: Error getting payer's email: ", payerError);
    return;
  }
  const payerEmail = payerData[0].email;

  // get payee's name
  const { data: payeeData, error: payeeError } = await supabase.from("user").select("first_name, last_name").eq("id", payeeUserId);
  if (payeeError) {
    console.log("SendCancelledTransactionNoticeProps: Error getting payee's name: ", payeeError);
    return;
  }
  const payeeName = `${payeeData[0].first_name} ${payeeData[0].last_name}`;

  console.log("SendCancelledTransactionNoticeProps: email sent to " + payerEmail)

  sendEmail({
    to: payerEmail,
    subject: `NOTICE: Request to reimburse $${amountOwed} to ${payeeName} has been cancelled.`,
    html: `
      <p>Request to reimburse $${amountOwed} to ${payeeName} has been cancelled.</p>
      <p>There is no further action from your part.</p>
    `,
  });
};

export default sendCancelledTransactionNotice;
