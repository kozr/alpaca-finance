import { emailQueue } from "./queues/email-queue";
import emailWorker from "./workers/email-worker"

// Email functions
async function sendPaymentRequestedNotice(paymentId) {
  try {
    await emailQueue.add(
      "sendPaymentRequestedNotice",
      {
        paymentId,
      },
    );
    return { isSuccessful: true, error: null };
  } catch (error) {
    return { isSuccessful: false, error: error };
  }
}

async function sendCancelledTransactionNotice(paymentId) {
  try {
    await emailQueue.add(
      "sendCancelledTransactionNotice",
      {
        paymentId,
      },
    );
    return { isSuccessful: true, error: null };
  } catch (error) {
    return { isSuccessful: false, error: error };
  }
}

async function listJobs(queueName) {
  try {
    switch (queueName) {
      case "emailQueue":
        const jobs = await emailQueue.getJobs();
        return { isSuccessful: true, error: null, jobs };
      default:
        return { isSuccessful: false, error: "Invalid queue name.", jobs: null };
    }
  } catch (error) {
    return { isSuccessful: false, error: error, jobs: null };
  }
}

emailWorker.run()

export { sendPaymentRequestedNotice, listJobs, sendCancelledTransactionNotice };
