import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('App Health')
@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello() {
    return 'Welcome to VAAD backend';
  }
}
