import { Module } from '@nestjs/common';
import { AlumnoControllerModule } from './controller/controller.module';
import { AlumnoServiceModule } from './service/service.module';
import { AlumnoRepositoryModule } from './repository/repository.module';
import { InscripcionGrupoRepositoryModule } from '../inscripciones-grupo/repository/repository.module';

/**
 * Módulo principal de Alumno
 * Agrupa todos los submódulos relacionados con la entidad Alumno
 * Importa InscripcionGrupoRepositoryModule para soportar el cascade delete
 */
@Module({
  imports: [
    AlumnoRepositoryModule,
    InscripcionGrupoRepositoryModule,
    AlumnoServiceModule,
    AlumnoControllerModule,
  ],
  exports: [AlumnoServiceModule],
})
export class AlumnoModule {}
