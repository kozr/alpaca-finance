import { Worker } from "bullmq";
import { redisConfiguration } from "@/utilities/redis";
import sendCancelledTransactionNotice from "@/utilities/jobs/emails/send-cancelled-transaction-notice";
import sendPaymentRequestedNotice from "@/utilities/jobs/emails/send-payment-requested-notice";

const emailWorkerJob = async (job) => {
  switch (job.name) {
    case "sendPaymentRequestedNotice":
      await sendPaymentRequestedNotice(job.data);
      break;
    case "sendCancelledTransactionNotice":
      await sendCancelledTransactionNotice(job.data);
      break;
    default:
      console.log(`Email Job: ${job.id} processed. No email sent.`);
  }
};

const emailWorker = new Worker("emailSchedule", emailWorkerJob, {
  connection: redisConfiguration.connection,
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
