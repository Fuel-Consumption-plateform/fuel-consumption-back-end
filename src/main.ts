//config dontenv
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import corsOptions from './config/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('fuelcomsuption/api');
  await app.listen(process.env.PORT || 3000);
  console.info(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
