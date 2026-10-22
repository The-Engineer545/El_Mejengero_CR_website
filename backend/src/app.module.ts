import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CamisetasModule } from './camisetas/camisetas.module';

@Module({
  imports: [CamisetasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
