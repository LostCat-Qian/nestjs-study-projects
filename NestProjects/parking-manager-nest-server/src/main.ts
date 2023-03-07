import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 允许跨域
  app.use(cors());

  await app.listen(3000);
}
bootstrap();
