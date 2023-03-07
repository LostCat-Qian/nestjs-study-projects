import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

// 异常拦截器就不需要 @Injectable() 装饰器了，使用 @Catch() 装饰器来进行修饰
@Catch()
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    // 通过 host 的 switchToHttp() 方法就可以获取到 http 请求的上下文对象
    const ctx = host.switchToHttp();
    // 获取请求和响应对象，两个方法都支持传入一个泛型
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // 通过 exception 对象可以获取到状态码、异常信息等一系列消息
    const status = exception.getStatus();

    response.status(status).json({
      success: false,
      time: new Date(),
      data: exception.message,
      status,
      path: request.url,
    });
  }
}
