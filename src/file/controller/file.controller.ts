import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../service/file.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly fileService: FileService) {}

  @Post('uploads')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    const result = await this.fileService.uploadFile(file);
    return result.url;
  }
}
