import { Module } from '@nestjs/common';
import { InscripcionGrupoService } from './inscripcion-grupo.service';
import { InscripcionGrupoRepositoryModule } from '../repository/repository.module';
import { GrupoRepositoryModule } from '../../grupo/repository/repository.module';
import { AlumnoRepositoryModule } from '../../alumno/repository/repository.module';

/**
 * Módulo del servicio de Inscripciones de Grupo
 */
@Module({
  imports: [
    InscripcionGrupoRepositoryModule,
    GrupoRepositoryModule,
    AlumnoRepositoryModule,
  ],
  providers: [InscripcionGrupoService],
  exports: [InscripcionGrupoService],
})
export class InscripcionGrupoServiceModule {}
