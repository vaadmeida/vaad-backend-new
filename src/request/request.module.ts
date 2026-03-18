import { Module } from '@nestjs/common';
import { RequestService } from './service/request.service';
import { RequestController } from './controller/request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaPlan, MediaPlanSchema } from './schema/media-plan.schema';

@Module({
  controllers: [RequestController],
  providers: [RequestService],
  imports: [
    MongooseModule.forFeature([
      { name: MediaPlan.name, schema: MediaPlanSchema },
    ]),
  ],
})
export class RequestModule {}
