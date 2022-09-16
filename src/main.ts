import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  NestjsWinstonLoggerService,
  appendRequestIdToLogger,
  appendIdToRequest,
} from 'nestjs-winston-logger';
import { format, transports } from 'winston';

export const myLogger = new NestjsWinstonLoggerService({
  format: format.combine(
    format.timestamp({ format: 'isoDateTime' }),
    format.json(),
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console(),
  ],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(myLogger);

  app.use(appendIdToRequest);
  app.use(appendRequestIdToLogger(myLogger));

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3003);
}
bootstrap();
