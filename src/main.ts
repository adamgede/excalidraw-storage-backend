import { LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Define all available log levels, ensuring they match your NestJS version.
  // Note: Your environment does not support 'fatal', so it must be removed.
  const allLogLevels: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error'];

  // Determine the desired log level from the environment variable.
  const envLevel = (process.env.LOG_LEVEL as LogLevel) || 'log';

  // Get the index of the specified level.
  const startIndex = allLogLevels.indexOf(envLevel);

  // If the level is valid, include all more-severe levels.
  // Add a type assertion to inform TypeScript that the result is indeed LogLevel[].
  const activeLogLevels = (startIndex !== -1)
    ? allLogLevels.slice(startIndex) as LogLevel[]
    : ['log'];

  const app = await NestFactory.create(AppModule, {
    logger: activeLogLevels,
  });

  // Call `enableCors()` after creating the application instance.
  app.enableCors({
    origin: true,
  });

  app.setGlobalPrefix(process.env.GLOBAL_PREFIX ?? '/api/v2');
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
