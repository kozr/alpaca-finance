import { sendEmail } from "@/utilities/nodemailer";

interface EmailCancelRequestProps {
  requesterEmail: string;
  requesterName: string;
  amountOwed: number;
}

const emailCancelRequest = async ({
  requesterEmail,
  requesterName,
  amountOwed,
}: EmailCancelRequestProps) => {
  const daysToCancel = 2;
  console.log("Email sent to " + requesterEmail)

  sendEmail({
    to: requesterEmail,
    subject: "You have been requested to reimburse $${amountOwed} from ${requesterName}.",
    html: `
      <p>You have been requested to reimburse $${amountOwed} from ${requesterName}.</p>
      <p>You have ${daysToCancel} days to decline this request, otherwise it will be automatically accepted.</p>
      <p>Please click on <placeholder> to (optionally) accept or decline this request.</p>
    `,
  });
};

export default emailCancelRequest;
