import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MySQLQueryCached } from 'src/mongo/schemas/mysql_query_cached.schema';

@Injectable()
export class TypeOrmConfigService {
  constructor(
    @InjectModel(MySQLQueryCached.name)
    private mysqlQueryCachedModel: Model<MySQLQueryCached>,
    private readonly configService: ConfigService,
  ) {}

  public async create(data: {
    rawQuery: string;
    parameters: Array<string | unknown>;
    type: string;
    trace: string;
    status: boolean;
  }) {
    if (!data || !data.type || data.type === null) {
      return;
    }
    try {
      const cached = new this.mysqlQueryCachedModel({
        ...data,
        host: this.configService.get('DATABASE_HOST'),
        database_name: this.configService.get('DATABASE_NAME'),
        user: this.configService.get('DATABASE_USER'),
      });
      await cached.save();
    } catch (err: any) {
      return;
    }
  }
}
