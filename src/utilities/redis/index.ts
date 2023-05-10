import Redis, { RedisOptions } from 'ioredis';
import url from 'url';

const redisUrl = url.parse(process.env.REDIS_URL);

export const redisOptions = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port),
  password: redisUrl.auth?.split(":")[1],
};

export const redisConnection = new Redis(redisOptions);
