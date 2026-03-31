import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  isNumber,
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

export class CreateBillboardDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  partnerId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  locationAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  landmark: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  height: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  width: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  units: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  rate: number;

  @ApiProperty({ enum: BillboardPrintProductType })
  @IsEnum(BillboardPrintProductType)
  @IsNotEmpty()
  printProductType: BillboardPrintProductType;

  @ApiProperty({ enum: BillboardServiceCategory })
  @IsEnum(BillboardServiceCategory)
  @IsNotEmpty()
  serviceType: BillboardServiceCategory;

  @ApiProperty({ enum: BillboardMediaTypeEnum })
  @IsEnum(BillboardMediaTypeEnum)
  @IsNotEmpty()
  mediaType: BillboardMediaTypeEnum;

  @ApiProperty({ enum: BillBoardOrientationEnum })
  @IsEnum(BillBoardOrientationEnum)
  @IsNotEmpty()
  orientation: BillBoardOrientationEnum;

  @ApiProperty({ enum: BillboardTargetAudience, isArray: true })
  @IsEnum(BillboardTargetAudience, { each: true })
  @IsNotEmpty()
  targetAudience: BillboardTargetAudience[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  photos: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features: string[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hotDeal: boolean;
}

export class SearchBillboardFilter {
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
  maxRate: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  minRate: number;

  @ApiProperty({ enum: BillboardPrintProductType })
  @IsEnum(BillboardPrintProductType)
  @IsArray()
  @IsOptional()
  printProductTypes: BillboardPrintProductType[];

  @ApiProperty({ enum: BillboardServiceCategory })
  @IsEnum(BillboardServiceCategory)
  @IsArray()
  @IsOptional()
  serviceTypes: BillboardServiceCategory[];

  @ApiProperty({ enum: BillboardMediaTypeEnum })
  @IsEnum(BillboardMediaTypeEnum)
  @IsArray()
  @IsOptional()
  mediaTypes: BillboardMediaTypeEnum[];

  @ApiProperty({ enum: BillBoardOrientationEnum })
  @IsEnum(BillBoardOrientationEnum)
  @IsArray()
  @IsOptional()
  orientations: BillBoardOrientationEnum[];

  @ApiProperty({ enum: BillboardTargetAudience })
  @IsEnum(BillboardTargetAudience)
  @IsArray()
  @IsOptional()
  targetAudiences: BillboardTargetAudience[];
}

export class PaginationFilter {
  @ApiProperty()
  @IsOptional()
  limit: number = 10;

  @ApiProperty()
  @IsOptional()
  page: number = 1;
}
