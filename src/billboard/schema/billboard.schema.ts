import {
  BillboardServiceCategory,
  BillboardTargetAudience,
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

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  width: number;

  @Prop({ default: 'meters' })
  units: string;

  @Prop({ required: true })
  rate: number;

  @Prop({ type: String, enum: BillboardPrintProductType, required: true })
  printProductType: BillboardPrintProductType;

  @Prop({ type: String, enum: BillboardServiceCategory, required: true })
  serviceType: BillboardServiceCategory;

  @Prop({ type: String, enum: BillboardMediaTypeEnum, required: true })
  mediaType: BillboardMediaTypeEnum;

  @Prop({ type: String, enum: BillBoardOrientationEnum, required: true })
  orientation: BillBoardOrientationEnum;

  @Prop({ type: [String], enum: BillboardTargetAudience, required: true })
  targetAudience: BillboardTargetAudience[];

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

  @Prop({ default: () => new Date() })
  availableDate: Date;
}

export const BillboardSchema = SchemaFactory.createForClass(Billboard);
