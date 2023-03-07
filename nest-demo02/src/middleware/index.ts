// 中间件
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class Logger implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // throw new Error('Method not implemented.');
    console.log('经过了 middleware');
    // res.send('拦截了请求');

    next();
  }
}
