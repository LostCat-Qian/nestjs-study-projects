import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as svgCaptcha from 'svg-captcha';
import { Request, Response } from 'express';

// @Controller('user')
@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // 定义验证码的接口
  @Get('getCode')
  createCode(@Req() req: Request, @Res() res: Response, @Session() session) {
    const Captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 34,
      background: '#cc9966',
    });

    // 存储 session
    session.code = Captcha.text;

    res.type('image/svg+xml');
    res.send(Captcha.data);
  }

  // 定义创建用户接口
  @Post('create')
  createUser(@Body() Body, @Session() session) {
    console.log(Body, session.code);

    // 用户在前端发送登录请求后，直接验证 Body 中传输的验证码内容与 session.code 进行比对即可
    if (session.code.toLocaleLowerCase() === Body?.code?.toLocaleLowerCase()) {
      return {
        code: 200,
        message: '登陆成功',
      };
    } else {
      return {
        code: 403,
        message: '验证码错误',
      };
    }
  }

  @Post()
  create(@Body() body) {
    // Post 请求同理，两种方式获取参数
    // 第一种是 @Request req，然后 req.body 获取 post 参数对象
    // 第二种是 @Body，直接使用body装饰器
    // 使用 @Body 时，可以直接获取body参数，比如获取name参数，可以直接 @Body('name') name
    console.log(body);
  }

  @Get()
  findAll(@Query() query) {
    // 这里有两种方式获取query参数
    // 第一种是 @Request() req，然后找到 req 中的 query 属性，就是query参数
    // 第二种是 @Query() query，直接使用query装饰器
    console.log(query);
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // 获取动态参数
    console.log(id);
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
