import { Module } from '@nestjs/common';
import { DocenteControllerModule } from './controller/controller.module';
import { DocenteServiceModule } from './service/service.module';
import { DocenteRepositoryModule } from './repository/repository.module';

/**
 * Módulo principal de Docente
 * Agrupa todos los submódulos relacionados con la entidad Docente
 */
@Module({
  imports: [
    DocenteRepositoryModule,
    DocenteServiceModule,
    DocenteControllerModule,
  ],
  exports: [DocenteServiceModule],
})
export class DocenteModule {}
