import { Module } from '@nestjs/common';
import { BillboardService } from './service/billboard.service';
import { BillboardController } from './controller/billboard.controller';

@Module({
  controllers: [BillboardController],
  providers: [BillboardService],
})
export class BillboardModule {}
