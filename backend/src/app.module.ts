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
        // Registra solas las entidades de cada módulo.
        autoLoadEntities: true,
        // Crea o ajusta las tablas según las entidades. Solo para desarrollo.
        synchronize: true,
      }),
    }),

    AuthModule,
    CamisetasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
