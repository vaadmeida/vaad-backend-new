import {
  BillBoardApprovalEnum,
  BillBoardFormatEnum,
  BillBoardIlluminationEnum,
  BillBoardVisibilityEnum,
} from './../enum/billboard.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  BillBoardOrientationEnum,
  BillboardPrintProductType,
  BillboardMediaTypeEnum,
} from '../enum/billboard.enum';
import { transform } from '@app/util/general/function/pascal-case.function';

@Schema({ timestamps: true })
export class Billboard {
  @Prop({ trim: true, uppercase: true })
  partnerId: string;

  @Prop({ default: () => new Date() })
  availableDate: Date;

  @Prop({ type: String, required: true })
  printProductType: BillboardPrintProductType;

  @Prop({ type: String, required: true })
  mediaType: BillboardMediaTypeEnum;

  @Prop({ default: 'meters' })
  dimension: string;

  @Prop({ type: String, required: true })
  orientation: BillBoardOrientationEnum;

  @Prop({ type: String, required: true })
  visibility: BillBoardVisibilityEnum;

  @Prop({ type: String, required: true })
  illumination: BillBoardIlluminationEnum;

  @Prop({ type: String, required: true })
  format: BillBoardFormatEnum;

  @Prop({ required: true })
  description: string;

  @Prop({ transform })
  locationAddress: string;

  @Prop({ transform })
  state: string;

  @Prop({ transform })
  city: string;

  @Prop({ transform })
  landmark: string;

  @Prop({ type: String, default: BillBoardApprovalEnum.DECLINED })
  approvalStatus: BillBoardApprovalEnum;

  @Prop({ required: true })
  height: number;

  @Prop()
  width: number;

  @Prop()
  size: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String] })
  photos: string[];

  @Prop({ default: false })
  hotDeal: boolean;

  @Prop({ default: 5 })
  rating: number;

  @Prop()
  favorite: boolean;

  @Prop({ type: [String], default: [] })
  features: string[];
}

export const BillboardSchema = SchemaFactory.createForClass(Billboard);
