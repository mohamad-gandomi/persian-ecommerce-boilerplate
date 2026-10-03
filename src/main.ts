import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { AppModule } from '@/app.module';
import { AllExceptionsFilter } from '@/common/filters/http-exception.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port', 4000);
  const apiPrefix = configService.get<string>('apiPrefix', 'api/v1');
  const corsOrigin = configService.get<string | string[]>('corsOrigin', '*');

  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.setGlobalPrefix(apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const uploadDir = path.resolve(process.cwd(), configService.get<string>('upload.dir', './uploads'));
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  app.useStaticAssets(uploadDir, { prefix: '/uploads/' });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('E-Commerce Shop API')
    .setDescription(
      'Clean modular REST API for e-commerce stores with WooCommerce-like variable products, customer & admin RBAC, categories tree, and blog articles.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Bearer token',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'E-Commerce API Docs',
  });

  await app.listen(port);
  logger.log(`🚀 E-Commerce Backend running at: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 Swagger OpenAPI Documentation at: http://localhost:${port}/api/docs`);
}

bootstrap();
