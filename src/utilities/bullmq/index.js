import { emailQueue } from "./queues/emailQueue";
import emailWorker from "./workers/emailWorker"

// Email functions
async function emailCancelRequest(email, requesterName, amount) {
  try {
    await emailQueue.add(
      "emailCancelRequest",
      {
        email,
        requesterName,
        amount,
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
    return { isSuccessful: false, error: error, jobs };
  }
}

export { emailCancelRequest, listJobs };
