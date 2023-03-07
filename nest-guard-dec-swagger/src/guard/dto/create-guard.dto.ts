import { ApiProperty } from '@nestjs/swagger';

export class CreateGuardDto {
  @ApiProperty({ example: 'Jack' }) // 描述参数
  name: string;

  @ApiProperty({ example: 18 })
  age: string;
}
