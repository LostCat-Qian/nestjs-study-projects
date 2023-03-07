import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository, Like } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const data = new User();
    data.name = createUserDto.name;
    data.desc = createUserDto.desc;
    return this.user.save(data);
  }

  async findAll(query: { keyWord: string; page: number; pageSize: number }) {
    const data = await this.user.find({
      where: {
        name: Like(`%${query.keyWord}%`),
      },
      order: {
        id: 'DESC',
      },
      // 分页功能 skip 类似于 offset
      skip: (query.page - 1) * query.pageSize,
      // 总共返回多少条，类似于 limit
      take: query.pageSize,
    });

    const total = this.user.count({
      where: {
        name: Like(`%${query.keyWord}%`),
      },
    });

    return {
      data,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.user.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.user.delete(id);
  }
}
