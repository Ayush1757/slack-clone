import mongoose from 'mongoose';

import { env } from './env';

const sanitizeMongoUri = (uri: string): string => {
  if (!uri) {
    return uri;
  }

  const schemeMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/i);
  if (!schemeMatch) {
    return uri;
  }

  const scheme = schemeMatch[1];
  const rest = schemeMatch[2];
  const lastAt = rest.lastIndexOf('@');

  if (lastAt === -1) {
    return uri;
  }

  const authPart = rest.substring(0, lastAt);
  const hostAndPath = rest.substring(lastAt + 1);
  const colonIdx = authPart.indexOf(':');

  if (colonIdx === -1) {
    return uri;
  }

  const user = authPart.substring(0, colonIdx);
  const pass = authPart.substring(colonIdx + 1);

  let decodedPass = pass;
  try {
    decodedPass = decodeURIComponent(pass);
  } catch {
    decodedPass = pass;
  }

  const encodedPass = encodeURIComponent(decodedPass);
  return `${scheme}${user}:${encodedPass}@${hostAndPath}`;
};

export const connectDatabase = async (): Promise<void> => {
  try {
    const targetUri = sanitizeMongoUri(env.MONGO_URI);
    await mongoose.connect(targetUri, { dbName: 'slack-clone' });
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};


