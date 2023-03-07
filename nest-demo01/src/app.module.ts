import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppService2 } from './app.service.two';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  // 这其实是一个简写
  // providers: [AppService],

  // 全写：
  providers: [
    AppService2,
    {
      provide: 'AppService',
      useClass: AppService,
    },
    {
      provide: 'Test',
      // 可以直接注入一个 value 值
      useValue: ['TB', 'PDD', 'JD', 'VIP'],
    },
    {
      provide: 'Fac',
      // 此处也可以通过 inject 来建立服务类的关联关系
      inject: [AppService2],
      // 然后注入的服务类就可以在工厂方法中作为形参使用
      // useFactory: (AppService2: AppService2): number => {
      //   // 一些逻辑...
      //   console.log(AppService2.getHello());
      //   return 123;
      // },

      // 这样的异步方式也是支持的
      useFactory: async (AppService2: AppService2): Promise<string> => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            resolve(AppService2.getHello());
          }, 2000);
        });
      },
    },
  ],
})
export class AppModule {}
