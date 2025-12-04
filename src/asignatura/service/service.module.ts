import { Module } from '@nestjs/common';
import { AsignaturaRepositoryModule } from '../repository/repository.module';
import { ProgramaEstudioRepositoryModule } from '../../programa-estudio/repository/repository.module';
import { GrupoRepositoryModule } from '../../grupo/repository/repository.module';
import { AsignaturaService } from './asignatura.service';

/**
 * Módulo del servicio de Asignatura
 * Importa los repositorios necesarios y exporta el servicio
 */
@Module({
  imports: [
    AsignaturaRepositoryModule,
    ProgramaEstudioRepositoryModule,
    GrupoRepositoryModule,
  ],
  providers: [AsignaturaService],
  exports: [AsignaturaService],
})
export class AsignaturaServiceModule {}
