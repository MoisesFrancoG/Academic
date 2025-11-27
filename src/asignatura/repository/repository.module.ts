import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { asignaturaProviders } from './asignatura.providers';

/**
 * Módulo del repositorio de Asignatura
 * Exporta los providers del repositorio para ser usados en otros módulos
 */
@Module({
  imports: [DatabaseModule],
  providers: [...asignaturaProviders],
  exports: [...asignaturaProviders],
})
export class AsignaturaRepositoryModule {}
