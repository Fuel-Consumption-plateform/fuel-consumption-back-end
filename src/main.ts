//config dontenv
import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import corsOptions from './config/cors';

async function bootstrap(port: number) {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('fuelcomsuption/api');
  await app.listen(port);
  console.info(`Application is running on ${await app.getUrl()}`)
}


async function start() {
  const ports = [3000, 3001, 3002];
  for (const port of ports) {
    await bootstrap(port);
  }
}
start();
