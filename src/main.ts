import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './exception_filter/prisma-exception.filter';
import { json, static as static_ } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('IIT Education')
    .setDescription('The IIT Education API description')
    .setVersion('0.1')
    .setContact('IIT', 'https://iit.vn/', 'info@iit.vn')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  // app.setGlobalPrefix('api');
  app.enableCors({
    // allowedHeaders: '*',
    origin: '*',
    // credentials: true,
  });
  app.use('/uploads', static_('uploads'));
  app.use('/thumbnails', static_('thumbnails'));
  app.use(json({ limit: '10mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(22899);
}
bootstrap();
