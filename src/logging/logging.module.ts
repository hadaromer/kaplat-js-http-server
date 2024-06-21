import { Global, Module } from '@nestjs/common';
import { requestLoggerConfig } from './request-logger.config';
import { booksLoggerConfig } from './books-logger.config';

@Global()
@Module({
  providers: [
    {
      provide: 'REQUEST_LOGGER',
      useValue: requestLoggerConfig,
    },
    {
      provide: 'BOOKS_LOGGER',
      useValue: booksLoggerConfig,
    },
  ],
  exports: ['REQUEST_LOGGER', 'BOOKS_LOGGER'],
})
export class LoggingModule {}
