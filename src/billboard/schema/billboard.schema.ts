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

// transform each word initial to uppercase

const transform = (sentence: string) => {
  return sentence
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

@Schema({ timestamps: true })
export class Billboard {
  @Prop({ trim: true })
  partnerId: string;

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

  @Prop({ type: String, enum: BillboardTargetAudience, required: true })
  targetAudience: BillboardTargetAudience;

  @Prop({ type: [String] })
  photos: string[];

  @Prop({ default: false })
  hotDeal: boolean;

  @Prop({ default: 5 })
  rating: number;

  @Prop({ default: () => new Date() })
  availableDate: Date;
}

export const BillboardSchema = SchemaFactory.createForClass(Billboard);
