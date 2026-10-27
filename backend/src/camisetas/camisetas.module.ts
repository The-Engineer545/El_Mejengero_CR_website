import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CamisetasController } from './camisetas.controller';
import { CamisetasService } from './camisetas.service';
import { Camiseta } from './models/camiseta.model';

@Module({
  imports: [TypeOrmModule.forFeature([Camiseta])],
  controllers: [CamisetasController],
  providers: [CamisetasService]
})
export class CamisetasModule {}
