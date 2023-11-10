import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MySQLConfig } from 'src/mongo/schemas/mysql_config.schema';
import { encrypt } from 'src/core/utils/encryption';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectModel(MySQLConfig.name) private mysqlConfigModel: Model<MySQLConfig>,
  ) {}

  async findByUserId(
    userId: string,
    onlyDefaultConnection: boolean | null = null,
  ): Promise<any> {
    if (!userId) throw new UnauthorizedException();
    const params: { user_id: string; default?: boolean } = {
      user_id: userId,
    };
    if (onlyDefaultConnection !== null) {
      params.default = onlyDefaultConnection;
    }
    const connections = await this.mysqlConfigModel.find(params);
    return {
      status: connections !== null ? 1 : 0,
      data: connections,
    };
  }

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
      default: false,
      user_id: 1,
    });
    return await newConnection.save();
  }
}
