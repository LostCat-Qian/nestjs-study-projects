import { Global, Module } from '@nestjs/common';
import { DynamicModule } from '@nestjs/common/interfaces/modules';

interface Options {
  path: string;
}

// 注册全局模块
// 为模块添加装饰器：@Global()
@Global()
// @Module 与 下面的 forRoot 可以结合着写
@Module({
  // providers: [
  //   {
  //     provide: 'Config',
  //     useValue: { baseUrl: '/api' },
  //   },
  // ],
  // // 注意点：即使把模块注册成了全局，也是需要导出的
  // exports: [
  //   {
  //     provide: 'Config',
  //     useValue: { baseUrl: '/api' },
  //   },
  // ],
})
export class ConfigModule {
  static forRoot(Options: Options): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'Config',
          useValue: { baseUrl: '/api' + Options.path },
        },
      ],
      // 注意点：即使把模块注册成了全局，也是需要导出的
      exports: [
        {
          provide: 'Config',
          useValue: { baseUrl: '/api' + Options.path },
        },
      ],
    };
  }
}
