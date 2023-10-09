import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { BullModule } from '@nestjs/bull';
import { ConfigProcessor } from './Jobs/update-config.processor';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConfigCached,
  ConfigCachedSchema,
} from 'src/mongo/schemas/config_cached.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from 'src/config/models/config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Config]),
    MongooseModule.forFeature([
      { name: ConfigCached.name, schema: ConfigCachedSchema },
    ]),
    BullModule.registerQueue({ name: 'config-queue' }),
  ],
  providers: [ConfigProcessor, ConfigService],
  controllers: [ConfigController],
})
export class ConfigModule {}
