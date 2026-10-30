import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  // Permite que el frontend (otro origen) consuma la API desde el navegador.
  // CORS_ORIGINS lista los orígenes permitidos separados por coma.
  const origenes = (process.env.CORS_ORIGINS ?? 'http://localhost:8080,http://127.0.0.1:8080')
    .split(',')
    .map((origen) => origen.trim());
  app.enableCors({ origin: origenes });
  // Render asigna el puerto en la variable PORT; en local se usa 3000.
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();