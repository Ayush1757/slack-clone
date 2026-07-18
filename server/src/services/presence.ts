import { getRedisClient } from '../config/redis';

const ONLINE_PREFIX = 'online:workspace:';
const CACHE_PREFIX = 'cache:';

export const addUserOnline = async (
  workspaceId: string,
  userId: string,
): Promise<void> => {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.sadd(`${ONLINE_PREFIX}${workspaceId}`, userId);
  } catch (error) {
    console.error('Redis addUserOnline error:', error);
  }
};

export const removeUserOnline = async (
  workspaceId: string,
  userId: string,
): Promise<void> => {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.srem(`${ONLINE_PREFIX}${workspaceId}`, userId);
  } catch (error) {
    console.error('Redis removeUserOnline error:', error);
  }
};

export const getOnlineUsersFromRedis = async (
  workspaceId: string,
): Promise<string[]> => {
  const redis = getRedisClient();
  if (!redis) return [];

  try {
    return await redis.smembers(`${ONLINE_PREFIX}${workspaceId}`);
  } catch (error) {
    console.error('Redis getOnlineUsers error:', error);
    return [];
  }
};

export const cacheSet = async (
  key: string,
  value: string,
  ttlSeconds: number = 300,
): Promise<void> => {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.setex(`${CACHE_PREFIX}${key}`, ttlSeconds, value);
  } catch (error) {
    console.error('Redis cacheSet error:', error);
  }
};

export const cacheGet = async (key: string): Promise<string | null> => {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    return await redis.get(`${CACHE_PREFIX}${key}`);
  } catch (error) {
    console.error('Redis cacheGet error:', error);
    return null;
  }
};

export const cacheDel = async (key: string): Promise<void> => {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.del(`${CACHE_PREFIX}${key}`);
  } catch (error) {
    console.error('Redis cacheDel error:', error);
  }
};
