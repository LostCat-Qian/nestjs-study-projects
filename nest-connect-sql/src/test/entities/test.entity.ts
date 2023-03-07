import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
} from 'typeorm';

@Entity()
export class Test {
  @PrimaryGeneratedColumn() // 配置为主键，能够自增
  id: number;

  // Column 可以接收一个配置对象，对象中是属性在数据库中的约束
  @Column({ type: 'varchar', length: 10, nullable: false })
  name: string;

  // 设置过滤，查询的时候将不会被返回给用户 select: true
  @Column({ nullable: false, select: true })
  password: string;

  @Column()
  age: number;

  // 自动生成 uuid
  @Generated()
  uuid: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  // 定义枚举类型
  @Column({ type: 'enum', enum: [-1, 0, 1], default: -1 })
  sex: number;
}
