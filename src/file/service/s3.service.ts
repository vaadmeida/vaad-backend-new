import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  readonly s3Client: S3Client;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(
    file: Buffer,
    bucketName: string,
    keyName: string,
    ContentType: string,
  ) {
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: bucketName,
        Key: keyName,
        Body: file,
        ContentType, // Recommended to set this explicitly
      },
      // Optional: configuration for concurrency
      queueSize: 4,
      partSize: 1024 * 1024 * 5, // 5MB parts
    });

    try {
      const result = await upload.done();

      return result;
    } catch (error) {
      this.logger.error(`Upload Failed: ${error}`);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }
}
