import { Queue } from "bullmq";
import { redisConnection } from "@/utilities/redis";

// Queues
const transactionQueue = new Queue("transactionSchedule", {
  connection: redisConnection
});

export {
  transactionQueue,
}