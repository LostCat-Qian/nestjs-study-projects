import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// 导入管道验证
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 挂载管道验证
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
