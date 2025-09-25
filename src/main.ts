import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Define the ordered log levels, from most verbose to least.
  const allLogLevels: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'];

  // Get the environment variable and default to 'log' if not set.
  const envLevel = process.env.LOG_LEVEL as LogLevel || 'log';

  // Find the index of the specified level in the array.
  const startIndex = allLogLevels.indexOf(envLevel);

  // Determine the final list of active log levels.
  // The slice() method will extract all levels from the specified level onwards.
  const activeLogLevels = (startIndex !== -1)
    ? allLogLevels.slice(startIndex, allLogLevels.length)
    : ['log']; // Fallback to a safe default if the level is not found.

  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: activeLogLevels,
  });

  app.setGlobalPrefix(process.env.GLOBAL_PREFIX ?? '/api/v2');
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
