import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File } from '../schema/file.schema';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  private logger = new Logger(FileService.name);
  private readonly bucketName: string;

  constructor(
    @InjectModel(File.name) private readonly FileModel: Model<File>,
    private readonly s3Service: S3Service,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.getOrThrow('AWS_S3_BUCKET');
  }

  async uploadFile(file: any) {
    const key = `${file.mimetype}/${file.originalname}`;

    const result = await this.s3Service.uploadFile(
      file.buffer,
      this.bucketName,
      key,
      file.mimetype,
    );

    const f = await this.FileModel.create({
      url: result.Location,
      key: decodeURIComponent(result.Location?.split('/').pop() || ''),
      contentType: file.mimetype,
    });

    return f;
  }

  uploadFiles(files: any[]) {
    return Promise.all(files.map((file) => this.uploadFile(file)));
  }
}
