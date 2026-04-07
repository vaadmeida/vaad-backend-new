import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Logger,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../service/file.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly fileService: FileService) {}

  @Post('uploads/many')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: any[]) {
    const results = await this.fileService.uploadFiles(files);
    return { fileUrls: results.map((f) => f.url) };
  }

  @Post('uploads')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    const result = await this.fileService.uploadFile(file);
    return { fileUrl: result.url };
  }
}
