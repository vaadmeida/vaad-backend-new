import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schema/users.schema';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) readonly UserModel: Model<User>) {}

  async createUser(user: Omit<User, 'deletedAt'>, session?: ClientSession) {
    const newUser = await this.UserModel.create([user], { session });

    return newUser[0];
  }

  async findOneUser(identifier: string) {
    const user = await this.UserModel.findOne({
      $or: [{ _id: identifier }, { email: identifier }],
    }).orFail(new NotFoundException('User not found'));

    return user;
  }
}
