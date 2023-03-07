import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

// 引入文件上传相关的包
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    // 导入模块
    MulterModule.register({
      storage: diskStorage({
        // 设置目标文件夹
        destination: join(__dirname, '../images'),
        // 设置文件名
        filename: (_, file, callback) => {
          // 通过获取当前时间戳和extname方法获取到的原始文件名后缀，进行新的文件名拼接
          const fileName = `${
            new Date().getTime() + extname(file.originalname)
          }`;
          // 调用 callback 进行存储，第一个参数为 error，第二个参数为文件名
          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
