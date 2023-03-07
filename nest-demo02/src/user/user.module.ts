import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

// 引入中间件
import { Logger } from 'src/middleware';
import { NestModule } from '@nestjs/common/interfaces/modules';

@Module({
  controllers: [UserController],
  providers: [UserService],
  // 如果想将 user 的相关模块变为共享模块的话，需要对其进行导出
  exports: [UserService],
})

// 要让请求经过中间件，需要实现一个接口 NestModule，然后实现接口方法 configure
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 使用 consumer 的 apply 方法，将我们的拦截器挂载上去，然后指定路由为 user 路径
    // consumer.apply(Logger).forRoutes('user');
    consumer
      .apply(Logger)
      .forRoutes({ path: 'user', method: RequestMethod.GET });
  }
}
