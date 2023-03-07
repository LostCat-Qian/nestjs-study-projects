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