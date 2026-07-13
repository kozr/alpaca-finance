import Redis, { RedisOptions } from 'ioredis';

const redisConnectionUrl =
  process.env.DEMO_REDIS_REDIS_URL ?? process.env.REDIS_URL;

if (!redisConnectionUrl) {
  throw new Error('A Redis connection URL is required');
}

const redisUrl = new URL(redisConnectionUrl);

export const redisOptions: RedisOptions = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || (redisUrl.protocol === 'rediss:' ? 6380 : 6379)),
  username: redisUrl.username
    ? decodeURIComponent(redisUrl.username)
    : undefined,
  password: redisUrl.password
    ? decodeURIComponent(redisUrl.password)
    : undefined,
  tls: redisUrl.protocol === 'rediss:' ? {} : undefined
};

export const redisConnection = new Redis(redisOptions);
