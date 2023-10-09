import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Model } from 'mongoose';
import { ConfigCached } from 'src/mongo/schemas/config_cached.schema';
import { Config } from 'src/config/models/config.entity';
import { Repository } from 'typeorm';

@Processor('config-queue')
export class ConfigProcessor {
  private readonly logger = new Logger(ConfigProcessor.name);

  constructor(
    @InjectRepository(Config) private configRepository: Repository<Config>,
    @InjectModel(ConfigCached.name)
    private configCachedModel: Model<ConfigCached>,
  ) {}

  @Process('update')
  async run(job: Job): Promise<void> {
    const configId = job.data.id;
    const configDescription = job.data.data.description;
    if (!configDescription) throw new Error('`description` is invalid');

    const original = await this.configRepository.findOneBy({
      id: parseInt(configId),
      status: '1',
    });
    if (!original) throw new Error(`Config ${configId} not found!`);
    const originalDescription = original.description;
    const modifiedDescription = configDescription;

    const updated = await this.configRepository.update(parseInt(configId), {
      description: configDescription,
    });

    console.log(updated);

    if (updated) {
      const cached = new this.configCachedModel({
        original: originalDescription,
        modified: modifiedDescription,
      });
      await cached.save();
      this.logger.debug(
        `Job #${job.id}: Updating config ${configId}... (Process: ${job.name})`,
      );
    } else {
      throw new Error(JSON.stringify(updated));
    }
  }

  @OnQueueCompleted()
  async onCompleted(job: Job) {
    this.logger.debug(`Job #${job.id}: Completed! (Process: ${job.name})`);
  }
}
