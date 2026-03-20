import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';

import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseLoggerInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  private readonly logger = new Logger(ResponseLoggerInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();

    const formattedDate = `${new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '')}`;

    this.logger.log(
      `\n[${formattedDate}] Request: ${req.method} ${req.originalUrl}, status: ${response.statusCode} `,
    );

    return next.handle();
  }
}
