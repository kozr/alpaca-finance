import Redis from 'ioredis';
import url from 'url';

const redisUrl = url.parse(process.env.REDIS_URL);

let redisOptions = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port),
  password: redisUrl.auth?.split(":")[1]
};

if (process.env.NODE_ENV !== 'development') {
  redisOptions['tls'] = {};
}

export const redisConnection = new Redis(redisOptions);
