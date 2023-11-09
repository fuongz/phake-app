import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MySQLConfig } from 'src/mongo/schemas/mysql_config.schema';
import { hash } from 'src/core/utils';
import { decrypt, encrypt } from 'src/core/utils/encryption';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(MySQLConfig.name) private mysqlConfigModel: Model<MySQLConfig>,
  ) {}

  async create(params) {
    const { host, user, database_name, password } = params.body;
    if (!host || !user || !database_name || !password) {
      throw new ForbiddenException();
    }
    const foundConnection = await this.mysqlConfigModel.findOne({
      host,
      user,
      database_name,
    });
    if (foundConnection) {
      throw new ConflictException();
    }
    const newConnection = new this.mysqlConfigModel({
      password: await encrypt(password),
      database_name,
      host,
      user,
      default: true,
      user_id: 1,
    });
    return await newConnection.save();
  }
}
