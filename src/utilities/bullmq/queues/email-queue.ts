import { Queue } from "bullmq";
import { redisOptions } from "@/utilities/redis";

// Queues
const emailQueue = new Queue("emailSchedule", {
  connection: redisOptions
});

export {
  emailQueue,
}