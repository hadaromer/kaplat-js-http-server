import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CaseSensitiveMiddleware } from './middleware/case-sensitive.middleware';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get<Logger>('BOOKS_LOGGER');
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalPipes(new ValidationPipe());
  app.use(CaseSensitiveMiddleware);
  await app.listen(8574);
}
bootstrap();
