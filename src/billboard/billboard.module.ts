import { Module } from '@nestjs/common';
import { BillboardService } from './service/billboard.service';
import { BillboardController } from './controller/billboard.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Billboard, BillboardSchema } from './schema/billboard.schema';

@Module({
  controllers: [BillboardController],
  providers: [BillboardService],
  imports: [
    MongooseModule.forFeature([
      { name: Billboard.name, schema: BillboardSchema },
    ]),
  ],
})
export class BillboardModule {}
