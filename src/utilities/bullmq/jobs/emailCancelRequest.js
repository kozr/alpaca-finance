// import nodemailer from "nodemailer";
const emailCancelRequest = async ({ email, requesterName, amount }) => {
  const daysToCancel = 2;
  console.log(
    `Email Job: emailCancelRequest processed. Message: =>\ 
     You have been requested to reimburse $${amount} from ${requesterName}.\ 
     You have ${daysToCancel} days to decline this request, otherwise it will be automatically accepted.\ 
     Please click on <placeholder> to (optionally) accept or decline this request.`
  );
};

export default emailCancelRequest

// nodemailer
// export default async function sendEmail({ to, subject, html }) {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_SERVER_HOST,
//     port: process.env.EMAIL_SERVER_PORT,
//     auth: {
//       user: process.env.EMAIL_SERVER_USER,
//       pass: process.env.EMAIL_SERVER_PASSWORD,
//     },
//   });

//   const info = await transporter.sendMail({
//     from: "money@alpacagroups.com",
//     to: to,
//     subject: subject,
//     html: html,
//   });

//   console.log("Message sent: %s", info.messageId);
// }
