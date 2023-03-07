import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('getUser')
  getUser(): string {
    // 如果不将 UserService 模块进行共享的话，这样就是不可行的
    return this.userService.findAll();
  }
}
