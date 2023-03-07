# Nest.js 基础 笔记

## 1. nest 命令快速生成 Controller、Service、Module

- 快速查看命令：`nest --help`
- 创建新的 Nest 项目：`nest new`
- Controller: `nest g co ControllerName`
- Service: `nest g s ServiceName`
- Module: `nest g mo ModuleName`

- 快速生成一个 CRUD 模板: `nest g resource TemplateName` or `nest g res TemplateName`

## 2. nest 开启接口版本控制

1. 在 main.ts 中通过 app 调用 app.enableVersioning
2. 引入 VersioningType，选择版本控制的类型
3. 进行版本控制
   1. 单个接口版本控制：直接给方法添加 version
   2. 全部版本控制：给 @Controller 装饰器传入一个对象，对象内包含路径 path 和 版本 version (值为字符串)
4. 访问时根路径前方添加版本号进行访问，例如版本 1：localhost:3000/v1/xxx...

## 3. nest 中使用 express-session 验证用户身份

1. 安装 express-session，需要代码提示可以安装 @types/express-session
2. main.ts 中引入，然后挂载到 app.use(session({ configuer...... }))
3. 配置参数详解：
   1. secret：生成服务端 session 签名，可以理解为加盐
   2. name：生成客户端 cookie 的名字，默认为 connect.sid
   3. cookie：设置返回到前端 key 的属性，默认值为 { path: '/', httpOnly: true, secure: false, maxAge: null }
   4. rolling： 在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认 false）
4. 可以通过 svg-captcha 库来进行验证码生成，让 session.code 携带验证码信息，然后通过用户传输的数据来进行校验

## 4. nest 中的提供者(providers)

1. 在 service 中定义一个服务层的类，让后使用 @Injectable 装饰器进行修饰
2. 然后在 module 中使用 @Module，将 service 注入到 providers 里面
3. 最后就可以在 controller 中通过依赖注入的方式进行使用了（private readonly XxxService: xxxService）
4. 学习了三种模式的服务类注入：
   1. useClass（类注入，直接在控制器的构造器 @Inject 即可）
   2. useValue（同理，但访问结果就是 useValue 中定义的结果）
   3. useFactory（访问结果就是工厂模式中所定义的结果，同时可以使用 inject 属性进行类注入，然后对其动手脚）

- 过程其实就是：IoC 存贮 key-value，controller 通过依赖注入的 key 名称传递给 IoC，然后 IoC 去 Service 寻找 value，最后通过一系列处理（包括实例化等）后，给 controller 直接使用，所以 controller 中能够直接通过 this.xxxService.methodName() 的方式直接使用服务层的方法

# Nest.js Project2 笔记

## 1. 模块 `@Module` 装饰器

### 1. 模块导出

- 如果想在 app.controller 中使用 user.service，本身是不可行的，因为 user 自己的所有模块仅在自己的模块内生效，所以需要将该模块共享
  - 在 user.module 中对其进行 exports 处理

### 2. 注册全局模块

- 在模块（xxx.module）的配置当中添加 @Global() 装饰器，然后导出模块即可

### 3. 动态模块（可给模块传参）

- 在模块的类中，可以通过添加静态方法的方式来允许传参，同时也可以结合 @Module 装饰器来使用
- 该静态方法需要一个返回一个对象，返回值类型为 `DynamicModule`
- 在 app.module 进行挂载的时候就可以通过该静态方法来为其值进行修改、接参等操作
  - 例如：`imports: [ ...OtherModule, ConfigModule.forRoot(参数列表) ]`，这样这个全局模块就可以变为动态模块

## 2. Middleware 中间件

### 1. 局部中间件

1. 定义一个中间件，中间件需要实现一个接口 `NestMiddleware`，然后实现接口方法 `use(req, res, next)`
2. 在需要经过中间件的模块中，让主类实现 `NestModule` 接口，实现接口方法 `configure(consumer: MiddlewareConsumer)`
3. 调用 configure 方法的形参 `consumer.apply(被挂载的中间件).forRoutes(指定被挂载的路由：字符串或控制器本身或对象格式)`
4. forRoutes() 方法：`'user'` 或 `UserController` 或 `{ path: 'user', Method: RequestMethod.GET(or POST...) }`

### 2. 全局中间件

1. 全局中间件是一个函数，直接写在 main.ts 中，函数签名为 `MiddleWareAll(req, res, next)`
2. 然后使用 app.use(MiddlewareAll) 进行挂载

> 全局中间件会拦截所有请求

### 3. 经由全局中间件处理跨域请求

1. 需要两个包：`cors` 和 `@types/cors`
2. main.ts 中导入 cors：`import * as cors from 'cors'`
3. `app.use(cors())` 挂载中间件

# Nest.js 拦截器（Interceptor）

## 1. 全局响应拦截器

1. 新建一个 response.ts 文件，新增拦截器类
2. 该类需要实现 `NestInterceptor` 接口，并实现接口方法 `intercept(context, next): Observable`
3. 返回一个 next().handle().pipe() 所处理的对象，对象可用 map 方法进行处理
4. 然后在 main.ts 中使用 `app.useGlobalInterceptors()` 方法进行挂载，挂载时 new 一个该构造器就行
5. 这样就可以保证返回的所有数据都被进行了包装

## 2. 全局异常拦截器

1. 新建拦截器 filter.ts 文件，新增一个类 HttpFilter
2. 该类需要实现一个接口 `ExceptionFilter`，然后实现接口方法 `catch(exception, host)`

   ```typescript
   catch(exception: HttpException, host: ArgumentsHost): any {
    // 通过 host 的 switchToHttp() 方法就可以获取到 http 请求的上下文对象
    const ctx = host.switchToHttp();
    // 获取请求和响应对象，两个方法都支持传入一个泛型
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
   
    // 通过 exception 对象可以获取到状态码、异常信息等一系列消息
    const status = exception.getStatus();
   
    response.status(status).json({
      success: false,
      time: new Date(),
      data: exception.message,
      status,
      path: request.url,
    });
   }
   ```

## 3. 补充：Nestjs内置管道-转换

- Nestjs 一共提供了八个内置用于转换的管道方法
- ValidationPipe
- ParseIntPipe
- ParseFloatPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- ParseEnumPipe
- DefaultValuePipe

- 用法：
  ```typescript
  @Get(':id')
  getHello(@Param('id', ParseIntPipe) id: number) {
    // dosomething...
    console.log(typeof id) // result: number
  }
  ```

# Nest.js 文件上传

## 1. Nestjs 上传图片-静态目录

### 1. 存储

1. 安装两个包：`multer` 和代码提示插件 `@types/multer`
2. 在需要使用文件上传模块的地方，imports 导入 MulterModule 以及下载的 Multer 中需要的方法
3. 调用 MulterModule.register() 方法，然后传入参数
   ```typescript
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
   ```
4. 导入成功的话，在打包后的 dist 目录下会生成 images 文件夹
5. 导入后，就可以在 controller 中进行使用了

### 2. 使用配置好的文件上传模块

1.  在文件上传接口中，除了访问路径之外，因为涉及到文件操作，所以还需要添加中间件 `@UseInterceptors()`
2.  如果上传的是单个文件，那么需要使用 `FileInterceptor`，如果是上传多个文件的话需要使用 `FilesInterceptor`
3.  然后在文件上传接口的对应方法的参数列表中使用 `@UploadedFile` 装饰器修饰形参 file，file 即是上传文件的信息

### 3. 获取/访问该静态资源

1. 在 main.ts 中引入类型支持 `NestExpressApplication`，并将其作为泛型给 `NestFactory.create<xxx>()` 方法
2. 使用 `app.useStaticAssets()` 方法设置静态资源目录
   ```typescript
   const app = await NestFactory.create<NestExpressApplication>(AppModule)
   app.useStaticAssets(join(__dirname, 'images'), {
     // some config...
     prefix: '/fizz'
   })
   ```
3. 然后就可以直接通过 url 对其进行访问

## 2. Nestjs 下载文件与文件流

### 1. 直接使用接口

1. 通过 path 包进行 url 拼接，获取到文件下载地址
2. 通过 @Response 拿到响应对象，然后直接通过响应对象的 `res.download()` 方法进行下载

### 2. 流文件下载

1. 安装一个包 `compressing`
2. 导入其 zip 方法，通过 zip 方法对文件进行处理

   ```typescript
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
   ```

3. 前端对流文件进行处理，用户才能正常下载
   ```javascript
   // 前端代码封装
   const useFetch = async (url) => {
     // 如果使用 axios 的话，就需要把 responseType 设置为返回 ArrayBuffer 或者 Blob 类型
     const res = await fetch(url).then((res) => res.arrayBuffer())
     const blob = new Blob([res])
     const downUrl = URL.createObjectURL(blob)
     const aTag = document.createElement('a')
     aTag.href = downUrl
     aTag.download = 'filename.zip'
     aTag.click()
   }
   ```

## 3. 总结

- 使用流的方式会更加麻烦，但是更加安全，因为可以对其进行加密等操作
- 使用 download 的方式更加简便，但是会有安全隐患

# Nest.js 数据库相关

## 1. 使用 typeOrm 连接 MySQL 数据库

1. 安装三个依赖：`@nestjs/typeorm`、`typeorm`、`mysql2`
2. 在 app.module 中引入 TypeOrmModule，并对其进行配置
   ```typescript
   imports: [
    // 使用并配置 typeOrm
    TypeOrmModule.forRoot({
      type: 'mysql', // 数据库类型
      username: 'root', // 用户名
      password: '010711', // 密码
      host: 'localhost', // 域名
      port: 3306, // 端口
      database: 'nestjstest', // 数据库库名
      // entities: [__dirname, '/**/*.entity{.ts, .js}'], // 实体对应的文件
      synchronize: true, // 是否自动将实体类同步到数据库
      retryDelay: 500, // 重试连接数据库间隔
      retryAttempts: 10, // 重试连接数据库的次数
      autoLoadEntities: true, // 是否自动加载实体，配置了此项为 true 的话，就不需要配置 entities 配置了
    }),
    TestModule,
   ],
   ```
3. 在 entity 实体类中，从 typeOrm 导入需要的装饰器，对实体中的属性进行配置

   ```typescript
   @Entity()
   export class Test {
    // primaryGeneratedColumn 可以接收参数，接收一个键类型，比如 uuid 等
     @PrimaryGeneratedColumn() // 配置为主键，能够自增
     id: number
   
     @Column()
     name: string
   
     @Column()
     password: string
   
     @Column()
     age: number
   }
   ```

# Nest.js 管道

## 1. 管道-验证

## 2. 管道-验证 DTO

1. 切换目录到需要进行参数校验的地方，使用 `nest g pi ModuleName` 生成管道验证
2. 生成的管道验证会包含 modulename.pipe.ts 文件
3. 在要使用的接口之间引入该文件即可，然后在参数装饰器的地方将其作为参数传递给装饰器，例如 `@Body(LoginPipe)`
4. 在 DTO 目录下定义数据的校验格式，如果需要更加高级的校验的话，就需要一些额外的工具库：`class-validator` `class-transformer`
5. 在 DTO 模块中导入 class-validator，通过其提供的注解为数据添加校验
6. 最后在 pipe 模块中，让 Pipe 类实现 `PipeTransform` 接口，实现其方法 `transform`

   ```typescript
   @Injectable()
   export class LoginPipe implements PipeTransform {
     async transform(value: any, metadata: ArgumentMetadata) {
       // 此时，value 就是被应用到的那个接口接收到的数据
       // metadata 就是一些元数据，例如 type、data 等
       // console.log(value, metadata);
   
       // plainToInstance 会把值给反射到 metatype 的类上
       const DTO = plainToInstance(metadata.metatype, value)
       // 验证
       const errors = await validate(DTO)
       if (errors.length) {
         throw new HttpException(errors, HttpStatus.BAD_REQUEST)
       }
   
       console.log(errors)
       console.log(DTO)
   
       return value
     }
   }
   ```
### 但是以上的方法过于麻烦，nest 为我们提供了更简便的方法

1. 直接在 main.ts 中引入 `ValidationPipe`
2. 然后挂载到 app 上即可：`app.useGlobalPipe(new ValidationPipe())`

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