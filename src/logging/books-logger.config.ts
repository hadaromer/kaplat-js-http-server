import * as winston from 'winston';

export const booksLoggerConfig = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss.SSS' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [new winston.transports.File({ filename: 'logs/books.log' })],
});
