import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Logger } from 'winston';
import {} from '../../logging/logging.module';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject('BOOKS_LOGGER') private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    if (status < 500 && status !== HttpStatus.BAD_REQUEST) {
      const requestNumber = request['requestId'];
      this.logger.error(`${errorMessage} | request #${requestNumber}`);
    }
    response.status(status).json({
      errorMessage,
    });
  }
}
