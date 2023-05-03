import { emailQueue } from "./queues/emailQueue";
import emailWorker from "./workers/emailWorker"

// Email functions
async function sendPaymentRequestedNotice(requesterEmail: string, requesterName: string, amountOwed: number) {
  try {
    await emailQueue.add(
      "sendPaymentRequestedNotice",
      {
        requesterName,
        requesterEmail,
        amountOwed,
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

export { sendPaymentRequestedNotice, listJobs };
