import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { Res, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Response } from 'express';
import { join } from 'path';
import { zip } from 'compressing';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 定义上传文件的接口
  @Post('album')
  // 因为涉及到文件操作，所以还需要中间件的支持
  // 如果上传的是单个文件，就需要 FileInterceptor，多个就需要 FilesInterceptor
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    console.log('file: ', file);
    return {
      message: '文件上传完毕',
    };
  }

  // 定义文件下载的接口
  @Get('download')
  download(@Res() res: Response) {
    const url = join(__dirname, '../images/1670660411915.jpg');
    res.download(url);
  }

  // 定义文件流的方式下载接口
  @Get('stream')
  async downStream(@Res() res: Response) {
    // 使用 zip 函数进行处理
    const url = join(__dirname, '../images/1670660411915.jpg');
    const tarStream = new zip.Stream();
    await tarStream.addEntry(url);

    // 注意：这里的文件类型为 stream，所以前端接收的格式应当是 ArrayBuffer 类型
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=chocola&vanula');

    tarStream.pipe(res);
  }

  @Post()
  create(@Body() createUploadDto: CreateUploadDto) {
    return this.uploadService.create(createUploadDto);
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
