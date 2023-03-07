import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 10 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 255 })
  desc: string;
}
