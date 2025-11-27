import { Module } from '@nestjs/common';
import { GrupoRepositoryModule } from './repository/repository.module';
import { GrupoServiceModule } from './service/service.module';
import { GrupoControllerModule } from './controller/controller.module';

/**
 * Módulo principal de Grupo
 * Agrega los módulos de repositorio, servicio y controlador
 */
@Module({
  imports: [GrupoRepositoryModule, GrupoServiceModule, GrupoControllerModule],
  exports: [GrupoServiceModule],
})
export class GrupoModule {}
