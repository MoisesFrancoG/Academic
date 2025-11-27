import { Module } from '@nestjs/common';
import { AsignaturaControllerModule } from './controller/controller.module';
import { AsignaturaServiceModule } from './service/service.module';
import { AsignaturaRepositoryModule } from './repository/repository.module';

/**
 * Módulo principal de Asignatura
 * Agrupa todos los submódulos relacionados con la entidad Asignatura
 */
@Module({
  imports: [
    AsignaturaRepositoryModule,
    AsignaturaServiceModule,
    AsignaturaControllerModule,
  ],
  exports: [AsignaturaServiceModule],
})
export class AsignaturaModule {}
