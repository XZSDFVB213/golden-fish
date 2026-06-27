import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [
      process.env.CLIENT_URL,
      'http://localhost:3000',
      'http://localhost:4200',
    ],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  await app.listen(5000);
}

bootstrap();
