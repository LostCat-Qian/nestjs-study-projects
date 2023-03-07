# Nest.js Project2 笔记

## 1. 模块 @Module 装饰器

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
