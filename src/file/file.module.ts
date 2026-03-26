import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileController } from './controller/file.controller';
import { S3Service } from './service/s3.service';
import { FileService } from './service/file.service';
import { fileModel } from './model/file.model';

@Module({
  providers: [S3Service, FileService],
  controllers: [FileController],
  imports: [MongooseModule.forFeatureAsync([fileModel])],
})
export class FileModule {}
