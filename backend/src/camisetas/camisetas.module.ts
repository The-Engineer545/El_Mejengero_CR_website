import { Module } from '@nestjs/common';
import { CamisetasController } from './camisetas.controller';
import { CamisetasService } from './camisetas.service';

@Module({
  controllers: [CamisetasController],
  providers: [CamisetasService]
})
export class CamisetasModule {}
