import http from 'http';
import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';

import { env } from './env';
import { User } from '../models/User';
import { IUserDocument } from '../interfaces/user.interface';

export interface AuthenticatedSocket extends Socket {
  user?: IUserDocument;
}

export const createSocketServer = (httpServer: http.Server): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }

        if (origin === env.CLIENT_URL) {
          callback(null, true);
          return;
        }

        if (env.NODE_ENV !== 'production') {
          try {
            const parsed = new URL(origin);
            if (parsed.hostname === 'localhost') {
              callback(null, true);
              return;
            }
          } catch {
            // fall through
          }
        }

        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;

      if (!token) {
        next(new Error('Authentication token is required'));
        return;
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as { sub: string };
      const user = await User.findById(decoded.sub).select('-password');

      if (!user) {
        next(new Error('User not found'));
        return;
      }

      socket.user = user;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  return io;
};
