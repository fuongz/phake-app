import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Config } from 'src/config/models/config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly configRepository: Repository<Config>,
  ) {}

  async findByName(name: string): Promise<Config | null> {
    return this.configRepository.findOneByOrFail({
      name: name,
      status: '1',
    });
  }
}
