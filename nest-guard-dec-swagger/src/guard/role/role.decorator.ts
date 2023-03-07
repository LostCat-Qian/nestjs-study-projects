import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  applyDecorators, // 它可以组合装饰器，把多个装饰器的结果进行组合返回
} from '@nestjs/common';
import type { Request } from 'express';

// 它默认实现了一个 @SetMetadata 的功能
export const Role = (...args: string[]) => SetMetadata('role', args);

// 封装一个自定义的参数装饰器
export const ReqUrl = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    console.log(data);
    return req.url;
    // return applyDecorators(Role, ReqUrl);
  },
);
