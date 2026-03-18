import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/users.schema';
import { ClientSession, Model, QueryFilter } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) readonly UserModel: Model<User>) {}

  async createUser(user: Partial<User>, session?: ClientSession) {
    const newUser = await this.UserModel.findOneAndUpdate(
      { email: user?.email?.toLowerCase() },
      { $set: user },
      { upsert: true, returnDocument: 'after', session },
    );

    return newUser;
  }

  async findOne(query: Partial<User & { id: string }>) {
    const filter: QueryFilter<User> = {};

    if (query.email) {
      filter.email = query.email.trim().toLowerCase();
    }

    if (query.id) {
      filter._id = query.id;
    }

    const user = await this.UserModel.findOne(filter).orFail(
      new NotFoundException('User not found'),
    );

    return user;
  }
}
