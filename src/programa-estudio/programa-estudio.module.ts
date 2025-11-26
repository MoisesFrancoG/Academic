import { Module } from '@nestjs/common';
import { ControllerModule } from './controller/controller.module';
import { ServiceModule } from './service/service.module';
import { ProgramaEstudioRepositoryModule } from './repository/repository.module';

/**
 * Módulo principal de Programa de Estudio
 * Integra todos los submódulos (controller, service, repository)
 */
@Module({
  imports: [ProgramaEstudioRepositoryModule, ServiceModule, ControllerModule],
})
export class ProgramaEstudioModule {}
