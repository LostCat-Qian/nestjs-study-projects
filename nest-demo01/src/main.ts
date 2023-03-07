import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// 1. 引入 express-session
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 开启接口的版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 2. 使用 session，类似于在 express 中使用
  app.use(
    session({
      secret: 'fizzDog',
      name: 'fizzdog.sid',
      cookie: { maxAge: 9999999 },
    }),
  );

  await app.listen(3000);
}
bootstrap();
