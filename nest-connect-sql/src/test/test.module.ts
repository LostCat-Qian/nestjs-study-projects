import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';

// 引入实体
import { Test } from './entities/test.entity';
// 引入 orm 的 module
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // 创建实体联系表
  imports: [TypeOrmModule.forFeature([Test])],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
