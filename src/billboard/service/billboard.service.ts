import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  CreateBillboardDTO,
  SearchBillboardFilter,
} from '../dto/billboard.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Billboard } from '../schema/billboard.schema';
import { Model } from 'mongoose';
import {
  BillBoardOrientationEnum,
  BillboardProductType,
  BillboardMediaTypeEnum,
  BillboardPrintProductType,
  BillboardLandmark,
  BillboardTargetAudience,
  BillboardServiceCategory,
} from '../enum/billboard.enum';
import { NigeriaStateCityMap } from '../dto/state-city.dto';
import { paginateResult } from '@app/util';
import { PaginationDto } from '@app/util/pagination/dto/paginate.dto';
import { UpdateBillboardDTO } from '../dto/update-billboard.dto';

@Injectable()
export class BillboardService {
  private readonly logger = new Logger(BillboardService.name);
  constructor(
    @InjectModel(Billboard.name)
    private readonly BillBoardModel: Model<Billboard>,
  ) {}
  assets() {
    return {
      services: Object.values(BillboardServiceCategory),
      mediaType: Object.values(BillboardMediaTypeEnum),
      orientation: Object.values(BillBoardOrientationEnum),
      productType: Object.values(BillboardProductType),
      printProductType: Object.values(BillboardPrintProductType),
      landmarks: Object.values(BillboardLandmark),
      statesAndCites: NigeriaStateCityMap,
      targetAudience: Object.values(BillboardTargetAudience),
    };
  }

  async createBillboard(payload: CreateBillboardDTO) {
    return this.BillBoardModel.create(payload);
  }

  async updateBillboard(id: string, payload: UpdateBillboardDTO) {
    return this.BillBoardModel.findByIdAndUpdate(id, payload, {
      returnDocument: 'after',
    });
  }

  async getOneBillboard(id: string) {
    return this.BillBoardModel.findById(id).orFail(
      new NotFoundException('Billboard not found'),
    );
  }

  async searchBillboards(
    query: SearchBillboardFilter,
    pg: PaginationDto = { page: 1, limit: 10 },
  ) {
    const filter = {};

    if ('maxRate' in query && query.maxRate !== undefined) {
      filter['rate'] = { $lte: query.maxRate };
    }

    if ('minRate' in query && query.minRate !== undefined) {
      filter['rate'] = { ...filter['rate'], $gte: query.minRate };
    }

    if ('partnerId' in query && query.partnerId !== undefined) {
      filter['partnerId'] = query.partnerId;
    }

    if ('locationAddress' in query && query.locationAddress !== undefined) {
      filter['locationAddress'] = query.locationAddress;
    }

    if ('state' in query && query.state !== undefined) {
      filter['state'] = query.state;
    }

    if ('city' in query && query.city !== undefined) {
      filter['city'] = query.city;
    }

    if ('landmark' in query && query.landmark !== undefined) {
      filter['landmark'] = query.landmark;
    }

    if ('mediaTypes' in query && query.mediaTypes !== undefined) {
      filter['mediaType'] = { $in: query.mediaTypes };
    }

    if ('orientations' in query && query.orientations !== undefined) {
      filter['orientation'] = { $in: query.orientations };
    }

    if ('printProductTypes' in query && query.printProductTypes !== undefined) {
      filter['printProductType'] = { $in: query.printProductTypes };
    }

    if ('targetAudiences' in query && query.targetAudiences !== undefined) {
      filter['targetAudience'] = { $in: query.targetAudiences };
    }

    if ('serviceTypes' in query && query.serviceTypes !== undefined) {
      filter['serviceType'] = { $in: query.serviceTypes };
    }

    if ('height' in query && query.height !== undefined) {
      filter['height'] = query.height;
    }

    if ('width' in query && query.width !== undefined) {
      filter['width'] = query.width;
    }

    if ('units' in query && query.units !== undefined) {
      filter['units'] = query.units;
    }

    return paginateResult(pg, filter, this.BillBoardModel, []);
  }
}
