import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { GuardService } from './guard.service';
import { CreateGuardDto } from './dto/create-guard.dto';
import { UpdateGuardDto } from './dto/update-guard.dto';
import { RoleGuard } from './role/role.guard';

// 引入自定义装饰器
import { Role, ReqUrl } from './role/role.decorator';

// 引入 swagger 相关的功能
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('guard')
@ApiBearerAuth() // 如果这个实体的接口都需要进行token鉴权的话，就可以添加这个装饰器
@ApiTags('守卫相关的接口') // 添加接口分组
@UseGuards(RoleGuard)
export class GuardController {
  constructor(private readonly guardService: GuardService) {}

  @Post()
  @ApiOperation({ summary: 'post接口', description: '新增一个实体' }) // 描述接口
  @ApiQuery({ name: 'page', description: '分页信息' }) // 类似 ApiParam
  create(@Body() createGuardDto: CreateGuardDto) {
    return this.guardService.create(createGuardDto);
  }

  @Get()
  // @SetMetadata('role', ['admin'])
  @Role('admin')
  @ApiResponse({ status: 403, description: '403 Forbidden' }) // 自定义一些返回描述
  findAll(@ReqUrl('someData') url: string) {
    console.log(url);
    return this.guardService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: '这是一个id', required: true }) // 描述动态参数
  findOne(@Param('id') id: string) {
    return this.guardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGuardDto: UpdateGuardDto) {
    return this.guardService.update(+id, updateGuardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guardService.remove(+id);
  }
}
