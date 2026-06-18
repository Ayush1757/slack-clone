import cors from 'cors';
import express from 'express';

import { env } from './config/env';
import { globalErrorHandler, notFoundHandler } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use('/api/auth', authRoutes);
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
