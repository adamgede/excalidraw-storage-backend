import { LogLevel, NestFactory, NestApplicationOptions } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Returns an array of log levels based on the environment variable.
 * @param envLevel The desired starting log level (e.g., 'verbose', 'debug', 'warn').
 */
function getLogLevels(envLevel: string | undefined): LogLevel[] {
  // Define all available log levels, in order from most verbose to least.
  const allLogLevels: LogLevel[] = ['verbose', 'debug', 'log', 'warn', 'error'];

  // Ensure the environment variable maps to a valid LogLevel.
  // We use `includes` to safely check if the string exists in our known levels.
  const isValidLevel = allLogLevels.includes(envLevel as LogLevel);
  if (!isValidLevel) {
    // If the value is invalid, default to 'log'.
    return ['log'];
  }

  // Slice the array to include the specified level and all more-severe levels.
  const startIndex = allLogLevels.indexOf(envLevel as LogLevel);
  return allLogLevels.slice(startIndex);
}

async function bootstrap() {
  const activeLogLevels = getLogLevels(process.env.LOG_LEVEL);

  const appOptions: NestApplicationOptions = {
    logger: activeLogLevels,
  };
  const app = await NestFactory.create(AppModule, appOptions);

  // Call `enableCors()` after creating the application instance.
  app.enableCors({
    origin: true,
  });

  app.setGlobalPrefix(process.env.GLOBAL_PREFIX ?? '/api/v2');
  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
