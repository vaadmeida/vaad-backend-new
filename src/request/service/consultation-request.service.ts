import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsultationRequest } from '../schema/consultation-request.schema';

@Injectable()
export class ConsultationRequestService {
  constructor(
    @InjectModel(ConsultationRequest.name)
    private readonly ConsultationRequestModel: Model<ConsultationRequest>,
  ) {}

  async createConsultationRequest(consultation: Partial<ConsultationRequest>) {
    return this.ConsultationRequestModel.create(consultation);
  }
}
