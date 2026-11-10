import { Type } from 'class-transformer';
import { PaymentType } from '../enum/payment.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsMongoId,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class OrderItemDTO {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  durationInMonths: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  billboardId: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startDate: Date;
}

export class CreateOrderPaymentDTO {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  orderItems: OrderItemDTO[];

  @ApiProperty()
  @IsString()
  brandName: string;

  @ApiProperty()
  @IsString()
  industry: string;

  @ApiProperty()
  @IsString()
  campaignObjective: string;

  @ApiProperty()
  @IsString()
  additionalInfo: string;

  @ApiProperty()
  @IsArray()
  documents: string[];

  @ApiProperty()
  @IsString()
  couponCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(PaymentType)
  paymentType: PaymentType;

  @ApiProperty()
  @IsBoolean()
  acceptTermsAndConditions: boolean;
}

export class PaginationFilter {
  @ApiProperty()
  @IsOptional()
  limit: number = 10;

  @ApiProperty()
  @IsOptional()
  page: number = 1;
}
