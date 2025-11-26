import { Module } from '@nestjs/common';
import { ProgramaEstudioController } from './programa-estudio.controller';
import { ServiceModule } from '../service/service.module';

/**
 * Módulo de controlador de Programa de Estudio
 * Expone los endpoints REST para la gestión de programas de estudio
 */
@Module({
  imports: [ServiceModule],
  controllers: [ProgramaEstudioController],
})
export class ControllerModule {}
