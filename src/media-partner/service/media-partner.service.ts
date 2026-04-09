import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MediaPartner } from '../schema/media-partner.schema';
import { ClientSession, Model, QueryFilter } from 'mongoose';

@Injectable()
export class MediaPartnerService {
  constructor(
    @InjectModel(MediaPartner.name)
    readonly MediaPartnerModel: Model<MediaPartner>,
  ) {}

  async createUser(user: Partial<MediaPartner>, session?: ClientSession) {
    const newUser = await this.MediaPartnerModel.findOneAndUpdate(
      { email: user?.email?.toLowerCase() },
      { $set: user },
      { upsert: true, returnDocument: 'after', session },
    );

    return newUser;
  }

  async findOne(query: Partial<MediaPartner & { id: string }>) {
    const filter: QueryFilter<MediaPartner> = {};

    if (query.email) {
      filter.email = query.email.trim().toLowerCase();
    }

    if (query.id) {
      filter._id = query.id;
    }

    const user = await this.MediaPartnerModel.findOne(filter).orFail(
      new NotFoundException('Media partner not found'),
    );

    return user;
  }

  async getPartnerIds(): Promise<string[]> {
    return this.MediaPartnerModel.distinct('partnerId');
  }
}
