import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GuardModule } from './guard/guard.module';

@Module({
  imports: [GuardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
