import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  // bodyParser: false para configurar el límite nosotros mismos abajo.
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  // Sube el límite del cuerpo de las peticiones a 5 MB. El valor por defecto
  // (100 KB) es muy bajo para las fotos que se suben desde el panel en base64.
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
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