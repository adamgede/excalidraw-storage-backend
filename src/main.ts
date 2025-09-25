import { LogLevel, NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Define all available log levels, ensuring they match your NestJS version.
  // Add 'fatal' only if your version supports it.
  const allLogLevels: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'];

  // Determine the desired log level from the environment variable.
  const envLevel = (process.env.LOG_LEVEL as LogLevel) || 'log';

  // Get the index of the specified level.
  const startIndex = allLogLevels.indexOf(envLevel);

  // If the level is valid, include all more-severe levels.
  const activeLogLevels = (startIndex !== -1)
    ? allLogLevels.slice(startIndex)
    : ['log'];

  // Create the application with the resolved log levels.
  const appOptions: NestApplicationOptions = {
    logger: activeLogLevels,
  };
  const app = await NestFactory.create(AppModule, appOptions);

  // Use app.enableCors() method after creating the application.
  app.enableCors({
    // You can also use a simple `true` to enable with default settings
    // or customize the options here.
    origin: true,
  });

  app.setGlobalPrefix(process.env.GLOBAL_PREFIX ?? '/api/v2');
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
