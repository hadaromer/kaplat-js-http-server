import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BookModule } from './book/book.module';
import { LoggingModule } from './logging/logging.module';
import { LoggingController } from './logging/logging.controller';
import { RequestCounterMiddleware } from './middleware/request-counter.middleware';

@Module({
  imports: [LoggingModule, BookModule],
  controllers: [LoggingController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestCounterMiddleware).forRoutes('*');
  }
}
