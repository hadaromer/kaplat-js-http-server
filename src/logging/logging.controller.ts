import { Controller, Get, HttpStatus, Put, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { requestLoggerConfig as requestLogger } from '../logging/request-logger.config';
import { booksLoggerConfig as booksLogger } from '../logging/books-logger.config';

@Controller('logs')
export class LoggingController {
  @Get('level')
  getLoggerLevel(
    @Query('logger-name') loggerName: string,
    @Res() res: Response,
  ) {
    let level: string;
    if (loggerName === 'request-logger') {
      level = requestLogger.level;
    } else if (loggerName === 'books-logger') {
      level = booksLogger.level;
    } else {
      res.status(HttpStatus.NOT_FOUND).send('Logger not found');
      return;
    }
    res.send(level.toUpperCase());
  }

  @Put('level')
  setLoggerLevel(
    @Query('logger-name') loggerName: string,
    @Query('logger-level') loggerLevel: string,
    @Res() res: Response,
  ) {
    if (!['error', 'info', 'debug'].includes(loggerLevel.toLowerCase())) {
      res.status(HttpStatus.BAD_REQUEST).send('Invalid log level');
      return;
    }

    if (loggerName === 'request-logger') {
      requestLogger.level = loggerLevel.toLowerCase();
    } else if (loggerName === 'books-logger') {
      booksLogger.level = loggerLevel.toLowerCase();
    } else {
      res.status(HttpStatus.NOT_FOUND).send('Logger not found');
      return;
    }
    res.send(loggerLevel.toUpperCase());
  }
}
