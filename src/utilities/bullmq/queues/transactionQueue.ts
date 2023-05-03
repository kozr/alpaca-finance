import { Queue } from "bullmq";
import { redisConfiguration } from "@/utilities/redis";

// Queues
const transactionQueue = new Queue("transactionSchedule", redisConfiguration);

export {
  transactionQueue,
}