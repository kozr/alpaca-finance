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
    return { error: null };
  } catch (error) {
    return { error: error };
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

async function sendRejectedPaymentNotice(paymentId) {
  try {
    await emailQueue.add("sendRejectedPaymentNotice", {
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
      case "transactionQueue":
        const transactionJobs = await transactionQueue.getJobs();
        return { isSuccessful: true, error: null, jobs: transactionJobs };
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
    await transactionQueue.add(
      "executeTransaction",
      {
        transactionId,
      },
      {
        delay,
      }
    );
    return { error: null };
  } catch (error) {
    return { error: error };
  }
}

async function attemptConfirmTransaction(transactionId) {
  try {
    await transactionQueue.add(
      "attemptConfirmTransaction",
      {
        transactionId,
      },
      {
        attempts: 1,
      }
    );
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
  sendRejectedPaymentNotice,
  attemptConfirmTransaction,
};
