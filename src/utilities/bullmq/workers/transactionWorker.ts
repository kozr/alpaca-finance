import executeTransaction from "../../jobs/transactions/executeTransaction";
import { Worker } from "bullmq";
import { redisConfiguration } from "@/utilities/redis";

const transactionWorkerJob = async (job) => {
  switch (job.name) {
    case "executeTransaction":
      await executeTransaction(job.data);
      break;
    default:
      console.log(`Transaction Job: ${job.id} processed. No transaction executed.`)
  }
};

const transactionWorker = new Worker("transactionSchedule", transactionWorkerJob, {
  connection: redisConfiguration.connection,
  autorun: false
});

console.log("Email Worker started.");

transactionWorker.on("completed", (job) => {
  console.info(`Email Job id: ${job.id} has completed!`);
});

transactionWorker.on("failed", (job, err) => {
  console.error(`Email Job id: ${job.id} has failed with ${err.message}`);
});

transactionWorker.on("error", (err) => {
  console.error(`Email Worker has errored with ${err.message}`);
});

export default transactionWorker;
