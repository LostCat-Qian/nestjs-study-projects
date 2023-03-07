import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ParkingModule } from './parking/parking.module';
import { CarModule } from './car/car.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [UserModule, ParkingModule, OrderModule, CarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
