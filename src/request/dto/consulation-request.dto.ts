import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestConsultationDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
