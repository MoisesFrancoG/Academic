import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { alumnoProviders } from './alumno.providers';

/**
 * Módulo del repositorio de Alumno
 * Exporta los providers del repositorio para ser usados en otros módulos
 */
@Module({
  imports: [DatabaseModule],
  providers: [...alumnoProviders],
  exports: [...alumnoProviders],
})
export class AlumnoRepositoryModule {}
