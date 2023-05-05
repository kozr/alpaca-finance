import { sendEmail } from "@/utilities/nodemailer";
import supabase from "@/utilities/supabase/backend";

interface SendRejectedPaymentNoticeProps {
  paymentId: number;
}

// send email to payer notifying them that their payment has been rejected
const sendRejectedPaymentNotice = async ({
  paymentId
}: SendRejectedPaymentNoticeProps) => {
  const { data: paymentData, error: paymentError } = await supabase.from("payment").select("*").eq("id", paymentId);
  if (paymentError) {
    console.log("SendRejectedPaymentNoticeProps: Error getting payment: ", paymentError);
    return;
  }

  // the payment table has payer_user_id and payee_user_id and also the amountOwed
  const payerUserId = paymentData[0].payer_user_id;
  const amountOwed = paymentData[0].amount;

  // get payer's email and full name
  const { data: payerData, error: payerError } = await supabase.from("user").select("email, first_name, last_name").eq("id", payerUserId);
  if (payerError) {
    console.log("SendRejectedPaymentNoticeProps: Error getting payer's email: ", payerError);
    return;
  }
  const payerEmail = payerData[0].email;
  const payer_name = `${payerData[0].first_name} ${payerData[0].last_name}`;

  console.log("SendRejectedPaymentNoticeProps: email sent to " + payerEmail)

  sendEmail({
    to: payerEmail,
    subject: `WARNING: Request to reimburse $${amountOwed} from ${payer_name} has been rejected.`,
    html: `
      <p>Request to reimburse $${amountOwed} from ${payer_name} has been rejected.</p>
      <p>This payment has been cancelled.</p>
      <p>If you have any questions, please contact the payee.</p>
      <p>This warning will strike your account for 7 days.</p>
    `,
  });
};

export default sendRejectedPaymentNotice;
