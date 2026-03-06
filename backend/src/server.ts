import app from './app';
import { env } from './config/env';
import { initDb } from './models';

async function start(): Promise<void> {
  try {
    await initDb(true);

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`API server listening on port ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

void start();
