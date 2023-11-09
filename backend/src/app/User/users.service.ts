import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/mongo/schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOne(query) {
    return this.userModel.findOne(query).select('+password').lean();
  }

  async findById(id) {
    return this.userModel.findById(id);
  }

  async findOneOr(queries: Array<{ [key: string]: string }>) {
    return this.userModel.findOne({ $or: queries }).select('+password');
  }

  async create(data: any) {
    const user = new this.userModel(data);
    return user.save();
  }
}
