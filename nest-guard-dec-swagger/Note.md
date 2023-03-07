# Nest.js 中的守卫、自定义装饰器、swagger 接口文档

## 1. Guard 守卫

- 切到想使用守卫的模块下，使用命令 `nest g gu GuardName` 为该模块生成一个 guard 守卫

### 1. 注册局部守卫

- 在控制器 controller 中引入生成的守卫，然后通过 `@UseGuards(GuardName)` 装饰器进行使用

### 2. 注册全局守卫

- 在 main.ts 中，导入需要挂载的守卫，使用 `app.useGlobalGuards(new GuardName())` 挂载一个全局守卫

### 3. 智能守卫

- 通过元信息 SetMetadata 进行判断

1. 在 controller 中引入装饰器 `@SetMetadata(metadataKey, value)`，使用装饰器装饰一个接口，为该接口设置元信息
2. 在守卫中，通过引入一个类 `Reflector`，通过依赖注入的方式将其引入
3. 获取元信息（`this.Reflector.get<T>(metadataKey, context.getHandler())`），
4. 通过元信息对接口权限进行一定的操作

## 2. Decorators 自定义装饰器

- 通过命令 `nest g d DecName` 来为一个模块生成一个自定义装饰器类
- 然后在生成的 guardName.decorator.ts 文件中编写自定义装饰器

## 3. swagger 接口文档

1. 首先引入两个包 `@nestjs/swagger` 和 `swagger-ui-express`
2. 在 main.ts 中对其进行初始化设置
   ```typescript
   // 设置 swagger
   const options = new DocumentBuilder()
     .setTitle('接口文档')
     .setDescription('这是示例接口的接口文档')
     .setVersion('1')
     .build()
   // 初始化接口文档
   const document = SwaggerModule.createDocument(app, options)
   SwaggerModule.setup('/api-docs', app, document)
   ```
3. 在 controller 中引入一系列 api 描述相关的装饰器，对 api 进行描述
4. 例如：@ApiParam()/@ApiQuery()/@ApiBearerAuth()/@ApiOperation()/@ApiResponse() 等
