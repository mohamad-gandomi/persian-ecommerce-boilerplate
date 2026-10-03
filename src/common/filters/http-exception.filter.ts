import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        message = (res as any).message || exception.message;
        errors = (res as any).error || null;
      } else {
        message = res;
      }
    } else if ((exception as any)?.code) {
      // Handle known Prisma error codes
      const prismaError = exception as any;
      if (prismaError.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        const target = prismaError.meta?.target ? ` (${prismaError.meta.target.join(', ')})` : '';
        message = `Unique constraint violation${target}. A record with this value already exists.`;
      } else if (prismaError.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = prismaError.meta?.cause || 'Record to operate on not found.';
      } else {
        this.logger.error('Unhandled Database Error:', prismaError);
        message = 'Database operation failed.';
      }
    } else {
      this.logger.error('Unhandled Exception:', exception);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
