import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import {
  BillBoardOrientationEnum,
  BillboardPrintProductType,
  BillboardServiceCategory,
  BillboardTargetAudience,
  BillboardMediaTypeEnum,
} from '../enum/billboard.enum';

export class UpdateBillboardDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  partnerId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  locationAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  landmark: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  height: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  width: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  units: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  rate: number;

  @ApiProperty({ enum: BillboardPrintProductType })
  @IsEnum(BillboardPrintProductType)
  @IsOptional()
  printProductType: BillboardPrintProductType;

  @ApiProperty({ enum: BillboardServiceCategory })
  @IsEnum(BillboardServiceCategory)
  @IsOptional()
  serviceType: BillboardServiceCategory;

  @ApiProperty({ enum: BillboardMediaTypeEnum })
  @IsEnum(BillboardMediaTypeEnum)
  @IsOptional()
  mediaType: BillboardMediaTypeEnum;

  @ApiProperty({ enum: BillBoardOrientationEnum })
  @IsEnum(BillBoardOrientationEnum)
  @IsOptional()
  orientation: BillBoardOrientationEnum;

  @ApiProperty({ enum: BillboardTargetAudience })
  @IsEnum(BillboardTargetAudience)
  @IsOptional()
  targetAudience: BillboardTargetAudience;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos: string[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hotDeal: boolean;
}
