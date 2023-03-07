import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 引入数据库相关的包
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestModule } from './test/test.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // 使用并配置 typeOrm
    TypeOrmModule.forRoot({
      type: 'mysql', // 数据库类型
      username: 'root', // 用户名
      password: '010711', // 密码
      host: 'localhost', // 域名
      port: 3306, // 端口
      database: 'nestjstest', // 数据库库名
      // entities: [__dirname, '/**/*.entity{.ts, .js}'], // 实体对应的文件
      synchronize: true, // 是否自动将实体类同步到数据库
      retryDelay: 500, // 重试连接数据库间隔
      retryAttempts: 10, // 重试连接数据库的次数
      autoLoadEntities: true, // 是否自动加载实体，配置了此项为 true 的话，就不需要配置 entities 配置了
    }),
    TestModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
