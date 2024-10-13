import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import * as http from 'http';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './exception/all-exception.filter';

const corsOptions: CorsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders:
    'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Accept-Versioning, Origin, Access-Control-Request-Origin, Access-Control-Request-Headers, Access-Control-Request-Method',
  exposedHeaders:
    'Content-Type, Authorization, Content-Length, X-Requested-With, Accept, Accept-Versioning, Origin, Access-Control-Request-Origin, Access-Control-Request-Headers, Access-Control-Request-Method',
  maxAge: 1728000,
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.enableCors(corsOptions);
  // transform data to DTO
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // handle global exception
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Life manager documents')
    .setDescription('The life manager API description')
    .setVersion('1.0')
    .addTag('life-manager')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  //  get port from env
  if (!port) {
    throw new Error('PORT must be defined at .env');
  }
  // Create HTTP server
  const server = http.createServer(app.getHttpAdapter().getInstance());

  app.useWebSocketAdapter(new IoAdapter(server));
  server.setTimeout(10 * 60 * 1000);
  await app.listen(port || 3001);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
