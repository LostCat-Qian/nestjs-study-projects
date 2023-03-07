import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RoleGuard } from './guard/role/role.guard';

// 引入 swagger 相关的包
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalGuards(new RoleGuard());

  // 设置 swagger
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('接口文档')
    .setDescription('这是示例接口的接口文档')
    .setVersion('1')
    .build();

  // 初始化接口文档
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
