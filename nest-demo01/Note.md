# Nest.js 基础 笔记

## 1. nest 命令快速生成 Controller、Service、Module

- 快速查看命令：`nest --help`
- Controller: `nest g co ControllerName`
- Service: `nest g s ServiceName`
- Module: `nest g mo ModuleName`

- 快速生成一个 CRUD 模板: `nest g resource TemplateName`

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
