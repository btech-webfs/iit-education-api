import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './exception_filter/prisma-exception.filter';
import { json, static as static_, urlencoded } from 'express';

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

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  // app.setGlobalPrefix('api');
  // app.use('/uploads', static_('uploads'));
  app.use('/thumbnails', static_('thumbnails'));
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ limit: '200mb', extended: true }));

  app.use((req, res, next) => {
    console.log('Method:', req.method, req.headers['x-original-uri'], req.headers['content-length']);
    next();
  });

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
