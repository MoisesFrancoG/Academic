import { Module } from '@nestjs/common';
import { DocenteServiceModule } from '../service/service.module';
import { DocenteController } from './docente.controller';

/**
 * Módulo del controlador de Docente
 * Importa el servicio y registra el controlador
 */
@Module({
  imports: [DocenteServiceModule],
  controllers: [DocenteController],
})
export class DocenteControllerModule {}
