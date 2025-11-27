import { Module } from '@nestjs/common';
import { AsignaturaServiceModule } from '../service/service.module';
import { AsignaturaController } from './asignatura.controller';

/**
 * Módulo del controlador de Asignatura
 * Importa el servicio y registra el controlador
 */
@Module({
  imports: [AsignaturaServiceModule],
  controllers: [AsignaturaController],
})
export class AsignaturaControllerModule {}
