import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // eslint-disable-next-line @typescript-eslint/no-un
  //const port = process.env.PORT || 3001;
  await app.listen(3000);
}
bootstrap();
