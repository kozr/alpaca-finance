import { sendEmail } from "@/utilities/nodemailer";
import supabase from "@/utilities/supabase/backend";

interface SendRejectedPaymentNoticeProps {
  paymentId: number;
}

// send email to payee notifying them that their payment has been rejected
const sendRejectedPaymentNotice = async ({
  paymentId
}: SendRejectedPaymentNoticeProps) => {
  const { data: paymentData, error: paymentError } = await supabase.from("payment").select("*").eq("id", paymentId);
  if (paymentError) {
    console.log("SendRejectedPaymentNoticeProps: Error getting payment: ", paymentError);
    return;
  }

  // the payment table has payee_user_id and payee_user_id and also the amountOwed
  const payeeUserId = paymentData[0].payee_user_id;
  const amountOwed = paymentData[0].amount;

  // get payee's email and full name
  const { data: payeeData, error: payeeError } = await supabase.from("user").select("email, first_name, last_name").eq("id", payeeUserId);
  if (payeeError) {
    console.log("SendRejectedPaymentNoticeProps: Error getting payee's email: ", payeeError);
    return;
  }
  const payeeEmail = payeeData[0].email;
  const payeeName = `${payeeData[0].first_name} ${payeeData[0].last_name}`;

  console.log("SendRejectedPaymentNoticeProps: email sent to " + payeeEmail)

  // get payer's name
  const { data: payerData, error: payerError } = await supabase.from("user").select("first_name, last_name").eq("id", paymentData[0].payer_user_id);
  if (payerError) {
    console.log("SendRejectedPaymentNoticeProps: Error getting payer's name: ", payerError);
    return;
  }
  const payerName = `${payerData[0].first_name} ${payerData[0].last_name}`;

  sendEmail({
    to: payeeEmail,
    subject: `WARNING: Request for $${amountOwed} from ${payerName} has been rejected.`,
    html: `
      <h1>Rejected Payment Request</h1>
      <p>
        The request for <strong>$${amountOwed}</strong> from <strong>${payeeName}</strong> has been rejected.
      </p>
      <p>If you have any questions, please contact the payee.</p>
      <p>
        <strong>Note:</strong> This warning will leave a strike on your account for a period of time.
      </p>
    `,
  });
};

export default sendRejectedPaymentNotice;
