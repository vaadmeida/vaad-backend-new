import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FavoriteBillboard } from '../schema/favorite-billboard.schema';
import { Model, QueryFilter } from 'mongoose';

@Injectable()
export class FavoriteBillboardService {
  private readonly logger = new Logger(FavoriteBillboardService.name);
  constructor(
    @InjectModel(FavoriteBillboard.name)
    private readonly FavoriteBillboardModel: Model<FavoriteBillboard>,
  ) {}

  async getOrCreateFavorites(userId: string) {
    const filter: QueryFilter<FavoriteBillboard> = { userId };
    let record = await this.FavoriteBillboardModel.findOne(filter);

    if (!record) {
      record = await this.FavoriteBillboardModel.create({
        userId,
        favorites: [],
      });
    }

    return record;
  }

  async saveFavorite(
    userId: string,
    billboardId: string,
  ): Promise<{ status: string }> {
    // Attempt to remove the ID from the favorites array
    const result = await this.FavoriteBillboardModel.updateOne(
      { userId, favorites: billboardId }, // Only match if the ID is actually in the list
      { $pull: { favorites: billboardId } },
    );

    // If modifiedCount is 1, it means we found the ID and removed it.
    if (result.modifiedCount > 0) {
      return { status: 'unlike' };
    }

    // If nothing was modified, it wasn't there. Add it.
    // 'upsert: true' creates the document if the user has no favorites record yet.
    await this.FavoriteBillboardModel.updateOne(
      { userId },
      { $addToSet: { favorites: billboardId } },
      { upsert: true },
    );

    return { status: 'like' };
  }
}
