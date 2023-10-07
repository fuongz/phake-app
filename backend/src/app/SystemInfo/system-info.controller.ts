import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { FormatResponseInterceptor } from 'src/core/interceptors/format-response.interceptor';
import { SystemInfoService } from './system-info.service';

@Controller('system-info')
@UseInterceptors(FormatResponseInterceptor)
export class SystemInfoController {
  constructor(private systemInfoService: SystemInfoService) {}

  @Get()
  getInfo() {
    return this.systemInfoService.getInfo();
  }
}
