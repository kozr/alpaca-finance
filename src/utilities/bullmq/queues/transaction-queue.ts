import { Queue } from "bullmq";
import { redisOptions } from "@/utilities/redis";

// Queues
const transactionQueue = new Queue("transactionSchedule", {
  connection: redisOptions
});

export {
  transactionQueue,
}