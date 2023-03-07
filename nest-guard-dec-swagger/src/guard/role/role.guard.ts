import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import type { Request } from 'express';
// 引入核心库中的 Reflector
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  // 他是依靠反射机制进行获取的，这里进行依赖注入
  constructor(private Reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('经过了guard守卫');

    // 拿到元信息
    const admin = this.Reflector.get<string[]>('role', context.getHandler());

    // 需求：如果有admin权限就允许访问，如果没有则拒绝访问
    const req = context.switchToHttp().getRequest<Request>();
    if (admin.includes(req.query.role as string)) {
      return true;
    } else {
      return false;
    }
  }
}
