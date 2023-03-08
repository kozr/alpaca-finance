import { Queue } from "bullmq";
import { redisConfiguration } from "@/utilities/redis";

// Queues
const emailQueue = new Queue("emailSchedule", redisConfiguration);

export {
  emailQueue,
}