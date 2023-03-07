import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Response } from './common/response';
import { HttpFilter } from './common/filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 挂载异常拦截器
  app.useGlobalFilters(new HttpFilter());

  // 挂载响应拦截器
  app.useGlobalInterceptors(new Response());

  await app.listen(3000);
}
bootstrap();
