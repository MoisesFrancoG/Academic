import { Module } from '@nestjs/common';
import { InscripcionGrupoController } from './inscripcion-grupo.controller';
import { InscripcionGrupoServiceModule } from '../service/service.module';

/**
 * Módulo del controlador de Inscripciones de Grupo
 */
@Module({
  imports: [InscripcionGrupoServiceModule],
  controllers: [InscripcionGrupoController],
})
export class InscripcionGrupoControllerModule {}
