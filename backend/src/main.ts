import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MainModule } from './main.module';

// Security
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.setGlobalPrefix('v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Enable CORS by whitelist origin
  app.enableCors({
    origin: (origin, callback) => {
      if (process.env.CORS_WHITELIST_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  });

  app.use(helmet());

  await app.listen(process.env.PORT || 3100);
}
bootstrap();
