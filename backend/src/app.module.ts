import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CamisetasModule } from './camisetas/camisetas.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Lee el archivo .env y deja sus variables disponibles en toda la app.
    ConfigModule.forRoot({ isGlobal: true }),

    // Conecta con la base de datos usando los datos del .env.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.getOrThrow<string>('DB_PORT')),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_NAME'),
        // TiDB Cloud exige conexión cifrada (TLS).
        ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
                // TiDB cierra las conexiones que pasan mucho rato sin uso.
        // Así las cerramos nosotros al minuto, antes de intentar usar una ya colgada.
        extra: { maxIdle: 1, idleTimeout: 60000 },
        // Registra solas las entidades de cada módulo.
        autoLoadEntities: true,
        // synchronize crea y ajusta las tablas solas. En TiDB vuelve a recrear
        // la columna 'imagen' en cada arranque y borra las fotos guardadas, por
        // eso en producción va apagado. Para preparar una base nueva y vacía,
        // poner DB_SYNC=true una vez, arrancar, y luego quitarlo.
        synchronize: config.get<string>('DB_SYNC') === 'true',
      }),
    }),

    AuthModule,
    CamisetasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
