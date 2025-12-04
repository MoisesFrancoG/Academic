import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { inscripcionGrupoProviders } from './inscripcion-grupo.providers';
import { InscripcionGrupoRepository } from './inscripcion-grupo.repository';

/**
 * Módulo del repositorio de Inscripciones de Grupo
 */
@Module({
  imports: [DatabaseModule],
  providers: [
    ...inscripcionGrupoProviders,
    {
      provide: 'IInscripcionGrupoRepository',
      useClass: InscripcionGrupoRepository,
    },
  ],
  exports: ['IInscripcionGrupoRepository'],
})
export class InscripcionGrupoRepositoryModule {}
