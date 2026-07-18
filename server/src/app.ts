import cors from 'cors';
import express from 'express';

import { env } from './config/env';
import { globalErrorHandler, notFoundHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import channelRoutes from './routes/channelRoutes';
import messageRoutes from './routes/messageRoutes';
import workspaceRoutes from './routes/workspaceRoutes';

const app = express();

const isAllowedDevOrigin = (origin: string): boolean => {
  try {
    const parsedOrigin = new URL(origin);
    return parsedOrigin.hostname === 'localhost';
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (origin === env.CLIENT_URL) {
        callback(null, true);
        return;
      }

      if (env.NODE_ENV !== 'production' && isAllowedDevOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;

