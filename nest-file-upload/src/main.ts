import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// 导入类型支持
import { NestExpressApplication } from '@nestjs/platform-express/interfaces';
import { join } from 'path';

async function bootstrap() {
  // 导入的类型支持作为泛型传入
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 然后就可以使用 useStaticAssets 方法去设置静态资源访问目录
  app.useStaticAssets(join(__dirname, 'images'), {
    // prefix: '/fizz',
  });

  await app.listen(3000);
}
bootstrap();
