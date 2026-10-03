import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((res) => {
        // If the handler already returned an object with data and meta
        if (res && typeof res === 'object' && 'data' in res && 'meta' in res) {
          return {
            success: true,
            statusCode,
            data: res.data,
            meta: res.meta,
          };
        }

        return {
          success: true,
          statusCode,
          data: res,
        };
      }),
    );
  }
}
