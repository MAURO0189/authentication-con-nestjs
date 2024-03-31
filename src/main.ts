import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    cors({
      origin: 'http://localhost:5173', // Reemplaza con la URL de tu frontend
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }),
  );
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    // eslint-disable-next-line @typescript-eslint/no-un
    await app.listen(3000);
  }
}
bootstrap();
