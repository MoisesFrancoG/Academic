import { Module } from '@nestjs/common';
import { AlumnoServiceModule } from '../service/service.module';
import { AlumnoController } from './alumno.controller';

/**
 * Módulo del controlador de Alumno
 * Importa el servicio y registra el controlador
 */
@Module({
  imports: [AlumnoServiceModule],
  controllers: [AlumnoController],
})
export class AlumnoControllerModule {}
