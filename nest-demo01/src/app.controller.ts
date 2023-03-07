import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  // constructor(private readonly appService: AppService) {}

  // 在 module 内如果手动更改了注入方式，那么就需要使用 @Inject 手动注入一下
  constructor(
    @Inject('AppService') private readonly appService: AppService,
    @Inject('Test') private readonly shop: Array<string>,
    @Inject('Fac') private readonly fac: number,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('shop')
  getShop(): Array<string> {
    // 接收后直接使用即可，IoC 帮我们完成了所有事
    return this.shop;
  }

  @Get('fac')
  getFac(): number {
    return this.fac;
  }
}
