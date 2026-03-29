import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../schema/admin.schema';
import { ClientSession, Model, QueryFilter } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) readonly AdminModel: Model<Admin>) {}

  async createUser(admin: Partial<Admin>, session?: ClientSession) {
    const newAdmin = await this.AdminModel.findOneAndUpdate(
      { email: admin?.email?.toLowerCase() },
      { $set: admin },
      { upsert: true, returnDocument: 'after', session },
    );

    return newAdmin;
  }

  async findOne(query: Partial<Admin & { id: string }>) {
    const filter: QueryFilter<Admin> = {};

    if (query.email) {
      filter.email = query.email.trim().toLowerCase();
    }

    if (query.id) {
      filter._id = query.id;
    }

    return this.AdminModel.findOne(filter).orFail(
      new NotFoundException('Admin not found'),
    );
  }
}
