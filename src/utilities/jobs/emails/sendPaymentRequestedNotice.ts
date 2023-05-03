import { sendEmail } from "@/utilities/nodemailer";

interface SendPaymentRequestedNotice {
  payerEmail: string;
  payeeName: string;
  amountOwed: number;
}

const sendPaymentRequestedNotice = async ({
  payerEmail,
  payeeName,
  amountOwed,
}: SendPaymentRequestedNotice) => {
  const daysToCancel = 2;
  console.log("sendPaymentRequestedNotice email sent to " + payerEmail)

  sendEmail({
    to: payerEmail,
    subject: `NOTICE: You have been requested to reimburse $${amountOwed} to ${payeeName}.`,
    html: `
      <p>You have been requested to reimburse $${amountOwed} to ${payeeName}.</p>
      <p>You have ${daysToCancel} days to decline this request, otherwise it will be automatically accepted.</p>
      <p>Please click on <placeholder> to (optionally) accept or decline this request.</p>
    `,
  });
};

export default sendPaymentRequestedNotice;
