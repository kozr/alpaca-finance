import { Worker } from "bullmq";
import { redisConnection } from "@/utilities/redis";
import sendCancelledPaymentNotice from "@/utilities/jobs/emails/payments/send-cancelled-payment-notice";
import sendPaymentRequestedNotice from "@/utilities/jobs/emails/payments/send-payment-requested-notice";
import sendRejectedPaymentNotice from "@/utilities/jobs/emails/payments/send-rejected-payment-notice";

const emailWorkerJob = async (job) => {
  switch (job.name) {
    case "sendPaymentRequestedNotice":
      await sendPaymentRequestedNotice(job.data);
      break;
    case "sendCancelledPaymentNotice":
      await sendCancelledPaymentNotice(job.data);
      break;
    case "sendRejectedPaymentNotice":
      await sendRejectedPaymentNotice(job.data);
    default:
      console.log(`Email Job: ${job.id} processed. No email sent.`);
  }
};

const emailWorker = new Worker("emailSchedule", emailWorkerJob, {
  connection: redisConnection,
  autorun: false
});

console.log("Email Worker started.");

emailWorker.on("completed", (job) => {
  console.info(`Email Job id: ${job.id} has completed!`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Email Job id: ${job.id} has failed with ${err.message}`);
});

emailWorker.on("error", (err) => {
  console.error(`Email Worker has errored with ${err.message}`);
});

export default emailWorker;
