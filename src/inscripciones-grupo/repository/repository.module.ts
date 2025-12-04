import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { inscripcionGrupoProviders } from './inscripcion-grupo.providers';
import { InscripcionGrupoRepository } from './inscripcion-grupo.repository';

/**
 * Módulo del repositorio de Inscripciones de Grupo
 * Exporta tanto el repositorio TypeORM como la implementación personalizada
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
  exports: [
    ...inscripcionGrupoProviders, // 🚨 CRÍTICO: Exportar el provider INSCRIPCION_GRUPO_REPOSITORY
    'IInscripcionGrupoRepository',
  ],
})
export class InscripcionGrupoRepositoryModule {}
