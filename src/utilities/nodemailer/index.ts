import nodemailer from "nodemailer";

type EmailProps = {
  to: string;
  subject: string;
  html: string;
};

// nodemailer
export async function sendEmail({ to, subject, html }: EmailProps) {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
      user: "alpacfinance@gmail.com",
      pass: process.env.SENDINBLUE_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: "Alpac Finance <alpacfinance@gmail.com>",
    to: to,
    subject: subject,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
}
