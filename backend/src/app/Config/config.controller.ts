import { Controller, UseInterceptors, Get, Patch, Req } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Request } from 'express';
import { FormatResponseInterceptor } from 'src/core/interceptors/format-response.interceptor';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { Config } from 'src/config/models/config.entity';

@Controller('configs')
@UseInterceptors(FormatResponseInterceptor)
export class ConfigController {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('config-queue')
    private readonly queueUpdateConfig: Queue,
  ) {}

  @Get(':name')
  findOne(@Req() request: Request): Promise<Config | null> {
    return this.configService.findByName(request.params.name);
  }

  @Patch(':id')
  async updatePatch(
    @Req() request: Request,
  ): Promise<{ job_id: string | number; id: string | number }> {
    const job: Job = await this.queueUpdateConfig.add(
      'update',
      {
        id: request.params.id,
        data: { ...request.body },
      },
      {
        removeOnFail: true,
      },
    );
    return {
      job_id: job.id,
      id: parseInt(request.params.id),
    };
  }
}
