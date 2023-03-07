import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class LoginPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    // 此时，value 就是被应用到的那个接口接收到的数据
    // metadata 就是一些元数据，例如 type、data 等
    // console.log(value, metadata);

    // plainToInstance 会把值给反射到 metatype 的类上
    const DTO = plainToInstance(metadata.metatype, value);
    // 验证
    const errors = await validate(DTO);
    if (errors.length) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }

    console.log(errors);
    console.log(DTO);

    return value;
  }
}
