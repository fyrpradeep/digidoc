import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://www.pmcare.org',
      'https://pmcare.org',
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    credentials: true,
  });

  app.useWebSocketAdapter(new IoAdapter(app));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 10000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 PMCare Backend running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
}
bootstrap();
