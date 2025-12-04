import { Module } from '@nestjs/common';
import { InscripcionGrupoRepositoryModule } from './repository/repository.module';
import { InscripcionGrupoServiceModule } from './service/service.module';
import { InscripcionGrupoControllerModule } from './controller/controller.module';

/**
 * Módulo principal de Inscripciones de Grupo
 * Agrupa todos los submódulos (Repository, Service, Controller)
 */
@Module({
  imports: [
    InscripcionGrupoRepositoryModule,
    InscripcionGrupoServiceModule,
    InscripcionGrupoControllerModule,
  ],
  exports: [InscripcionGrupoRepositoryModule, InscripcionGrupoServiceModule],
})
export class InscripcionGrupoModule {}
