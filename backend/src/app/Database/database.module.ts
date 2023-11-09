import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MySQLConfig,
  MySQLConfigSchema,
} from 'src/mongo/schemas/mysql_config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MySQLConfig.name, schema: MySQLConfigSchema },
    ]),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
})
export class DatabaseModule {}
