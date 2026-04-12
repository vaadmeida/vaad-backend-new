import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
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
  orderItems: OrderItemDTO[];
}

export class PaginationFilter {
  @ApiProperty()
  @IsOptional()
  limit: number = 10;

  @ApiProperty()
  @IsOptional()
  page: number = 1;
}
