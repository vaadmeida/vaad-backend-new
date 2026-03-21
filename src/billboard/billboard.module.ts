import { Module } from '@nestjs/common';
import { BillboardService } from './service/billboard.service';
import { BillboardController } from './controller/billboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Billboard, BillboardSchema } from './schema/billboard.schema';
import {
  FavoriteBillboard,
  FavoriteBillboardSchema,
} from './schema/favorite-billboard.schema';
import { FavoriteBillboardService } from './service/favorite-billboard.service';

@Module({
  controllers: [BillboardController],
  providers: [BillboardService, FavoriteBillboardService],
  imports: [
    MongooseModule.forFeature([
      { name: Billboard.name, schema: BillboardSchema },
      { name: FavoriteBillboard.name, schema: FavoriteBillboardSchema },
    ]),
  ],
})
export class BillboardModule {}
