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
