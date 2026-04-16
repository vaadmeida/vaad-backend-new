import { Module } from '@nestjs/common';
import { MediaPlanRequestService } from './service/media-plan-request.service';
import { RequestController } from './controller/request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MediaPlanRequest,
  MediaPlanRequestSchema,
} from './schema/media-plan-request.schema';
import {
  ConsultationRequest,
  ConsultationRequestSchema,
} from './schema/consultation-request.schema';
import { ConsultationRequestService } from './service/consultation-request.service';
import { RequestEmailTemplate } from './template/request.template';

@Module({
  controllers: [RequestController],
  providers: [
    MediaPlanRequestService,
    ConsultationRequestService,
    RequestEmailTemplate,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: MediaPlanRequest.name, schema: MediaPlanRequestSchema },
      { name: ConsultationRequest.name, schema: ConsultationRequestSchema },
    ]),
  ],
})
export class RequestModule {}
