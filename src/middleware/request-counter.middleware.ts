import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';

@Injectable()
export class RequestCounterMiddleware implements NestMiddleware {
  private static requestCount = 0;

  constructor(@Inject('REQUEST_LOGGER') private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    RequestCounterMiddleware.requestCount++;
    req['requestId'] = RequestCounterMiddleware.requestCount;

    const start = Date.now();
    this.logger.info(
      `Incoming request | #${req['requestId']} | resource: ${req.baseUrl} | HTTP Verb ${req.method.toUpperCase()} | request #${req['requestId']}`,
    );

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.debug(
        `request #${req['requestId']} duration: ${duration}ms | request #${req['requestId']}`,
        { context: 'request-logger' },
      );
    });

    next();
  }
}
