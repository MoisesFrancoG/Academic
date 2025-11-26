import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProgramaEstudioModule } from './programa-estudio/programa-estudio.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ProgramaEstudioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
