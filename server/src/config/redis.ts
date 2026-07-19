import Redis from 'ioredis';

import { env } from './env';

let redisClient: Redis | null = null;
let redisSubscriber: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn('Redis: Max retry attempts reached, giving up');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    redisClient.on('error', (err) => {
      console.error('Redis client error:', err.message);
    });
  }

  return redisClient;
};

export const getRedisSubscriber = (): Redis | null => {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!redisSubscriber) {
    redisSubscriber = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redisSubscriber.on('connect', () => {
      console.log('Redis subscriber connected');
    });

    redisSubscriber.on('error', (err) => {
      console.error('Redis subscriber error:', err.message);
    });
  }

  return redisSubscriber;
};

export const connectRedis = async (): Promise<boolean> => {
  const client = getRedisClient();
  const subscriber = getRedisSubscriber();

  if (!client || !subscriber) {
    console.log('Redis URL not configured, running without Redis');
    return false;
  }

  try {
    await client.connect();
    await subscriber.connect();
    console.log('✓ Redis connected');
    return true;
  } catch (error) {
    console.warn('Redis connection failed, running without Redis:', error);
    redisClient = null;
    redisSubscriber = null;
    return false;
  }
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
  if (redisSubscriber) {
    await redisSubscriber.quit();
    redisSubscriber = null;
  }
};
