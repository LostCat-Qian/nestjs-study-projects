import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService2 {
  getHello(): string {
    return 'this is AppService2.';
  }
}
