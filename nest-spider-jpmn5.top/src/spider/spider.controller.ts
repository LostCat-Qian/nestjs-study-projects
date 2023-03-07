import { Controller, Get } from '@nestjs/common';
import { Param } from '@nestjs/common/decorators';
import { SpiderService } from './spider.service';

@Controller('spider')
export class SpiderController {
  constructor(private readonly spiderService: SpiderService) {}

  @Get()
  downloadAll() {
    return this.spiderService.downloadAll();
  }
}
