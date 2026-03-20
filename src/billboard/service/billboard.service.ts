import { Injectable, Logger } from '@nestjs/common';
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

    if ('mediaType' in query && query.mediaType !== undefined) {
      filter['mediaType'] = query.mediaType;
    }

    if ('orientation' in query && query.orientation !== undefined) {
      filter['orientation'] = query.orientation;
    }

    if ('printProductType' in query && query.printProductType !== undefined) {
      filter['printProductType'] = query.printProductType;
    }

    if ('targetAudience' in query && query.targetAudience !== undefined) {
      filter['targetAudience'] = query.targetAudience;
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

    if ('serviceType' in query && query.serviceType !== undefined) {
      filter['serviceType'] = query.serviceType;
    }

    return paginateResult(pg, filter, this.BillBoardModel, []);
  }
}
