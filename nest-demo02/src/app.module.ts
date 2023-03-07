import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ListModule } from './list/list.module';

// 导出全局模块后也是需要进行注册的
import { ConfigModule } from './config/config,module';

@Module({
  imports: [
    UserModule,
    ListModule,
    ConfigModule.forRoot({
      path: '/fizzdog',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
