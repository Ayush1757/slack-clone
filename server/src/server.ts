import http from 'http';

import { createAdapter } from '@socket.io/redis-adapter';

import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { connectRedis, getRedisClient, getRedisSubscriber } from './config/redis';
import { createSocketServer } from './config/socket';
import { registerSocketHandlers } from './socket/socketHandlers';

const server = http.createServer(app);
const io = createSocketServer(server);

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  const redisConnected = await connectRedis();

  if (redisConnected) {
    const pubClient = getRedisClient();
    const subClient = getRedisSubscriber();

    if (pubClient && subClient) {
      io.adapter(createAdapter(pubClient, subClient));
      console.log('Socket.IO Redis adapter configured');
    }
  }

  registerSocketHandlers(io);

  server.listen(env.PORT, () => {
    console.log(`✓ Server running on port ${env.PORT}`);
  });
};

void bootstrap();

export { io };


