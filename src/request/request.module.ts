import { Module } from '@nestjs/common';
import { MediaPlanRequestService } from './service/request.service';
import { RequestController } from './controller/request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MediaPlanRequest,
  MediaPlanRequestSchema,
} from './schema/media-plan-request.schema';

@Module({
  controllers: [RequestController],
  providers: [MediaPlanRequestService],
  imports: [
    MongooseModule.forFeature([
      { name: MediaPlanRequest.name, schema: MediaPlanRequestSchema },
    ]),
  ],
})
export class RequestModule {}
