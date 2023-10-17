import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MySQLQueryCached,
  MySQLQueryCachedSchema,
} from 'src/mongo/schemas/mysql_query_cached.schema';
import { TypeOrmConfigService } from './typeorm-config.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MySQLQueryCached.name, schema: MySQLQueryCachedSchema },
    ]),
  ],
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService],
})
export class TypeOrmConfigModule {}
