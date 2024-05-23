import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CaseSensitiveMiddleware } from './middleware/case-sensitive.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(CaseSensitiveMiddleware);
  await app.listen(8574);
}
bootstrap();
