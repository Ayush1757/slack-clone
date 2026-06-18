import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

void bootstrap();
