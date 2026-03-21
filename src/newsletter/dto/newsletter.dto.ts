import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class JoinNewsletterDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
