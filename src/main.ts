import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Configuración de pipes de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Registrar el filtro de excepciones globalmente
  app.useGlobalFilters(new HttpExceptionFilter());

  // Registrar el interceptor de transformación globalmente
  app.useGlobalInterceptors(new TransformInterceptor());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Academic API')
    .setDescription('API para gestión académica')
    .setVersion('1.0')
    .addTag('academic')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
