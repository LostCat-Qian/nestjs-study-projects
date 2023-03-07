import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// 引入跨域请求相关的包
import * as cors from 'cors';

// 使用全局中间件（关于token认证之类的操作就可以在此完成）
import { Request, Response, NextFunction } from 'express';

// 设置全局的访问白名单
const whiteList = ['/list'];

function MiddlewareAll(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl);

  if (whiteList.includes(req.originalUrl)) {
    next();
  } else {
    res.send({
      message: '请求不在白名单中',
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 处理跨域请求
  app.use(cors());

  // 挂载全局中间件
  app.use(MiddlewareAll);

  await app.listen(3000);
}
bootstrap();
