import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { alumnoProviders } from './alumno.providers';
import { InscripcionGrupoRepositoryModule } from '../../inscripciones-grupo/repository/repository.module';

/**
 * Módulo del repositorio de Alumno
 * Exporta los providers del repositorio para ser usados en otros módulos
 * Importa InscripcionGrupoRepositoryModule para soportar el cascade delete en AlumnoRepository
 */
@Module({
  imports: [DatabaseModule, InscripcionGrupoRepositoryModule],
  providers: [...alumnoProviders],
  exports: [...alumnoProviders],
})
export class AlumnoRepositoryModule {}
