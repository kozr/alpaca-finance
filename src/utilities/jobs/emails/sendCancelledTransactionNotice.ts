import { sendEmail } from "@/utilities/nodemailer";

interface sendCancelledTransactionNoticeProps {
  payerEmail: string;
  payeeName: string;
  amountOwed: number;
}

const sendCancelledTransactionNotice = async ({
  payerEmail,
  payeeName,
  amountOwed,
}: sendCancelledTransactionNoticeProps) => {
  console.log("cancelledTransactionNotice email sent to " + payerEmail)

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
