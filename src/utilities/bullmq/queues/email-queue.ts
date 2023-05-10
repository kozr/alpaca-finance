import { Queue } from "bullmq";
import { redisConnection } from "@/utilities/redis";

// Queues
const emailQueue = new Queue("emailSchedule", {
  connection: redisConnection
});

export {
  emailQueue,
}