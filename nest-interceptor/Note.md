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