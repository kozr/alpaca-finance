import { emailQueue } from "./queues/email-queue";
import { transactionQueue } from "./queues/transaction-queue";
import emailWorker from "./workers/email-worker";
import transactionWorker from "./workers/transaction-worker";

// Email functions
async function sendPaymentRequestedNotice(paymentId) {
  try {
    await emailQueue.add("sendPaymentRequestedNotice", {
      paymentId,
    });
    return { isSuccessful: true, error: null };
  } catch (error) {
    return { isSuccessful: false, error: error };
  }
}

async function sendCancelledPaymentNotice(paymentId) {
  try {
    await emailQueue.add("sendCancelledPaymentNotice", {
      paymentId,
    });
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
        return {
          isSuccessful: false,
          error: "Invalid queue name.",
          jobs: null,
        };
    }
  } catch (error) {
    return { isSuccessful: false, error: error, jobs: null };
  }
}

// Transaction functions
async function executeTransaction(transactionId, delay = 0) {
  try {
    await transactionQueue.add("executeTransaction", {
      transactionId,
    }, {
      delay
    });
    return { isSuccessful: true, error: null };
  } catch (error) {
    return { isSuccessful: false, error: error };
  }
}

// Start the workers
emailWorker.run();
transactionWorker.run();

export {
  sendPaymentRequestedNotice,
  listJobs,
  sendCancelledPaymentNotice,
  executeTransaction,
};
