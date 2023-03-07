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
