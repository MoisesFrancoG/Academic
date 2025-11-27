import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { docenteProviders } from './docente.providers';

/**
 * Módulo del repositorio de Docente
 * Exporta los providers del repositorio para ser usados en otros módulos
 */
@Module({
  imports: [DatabaseModule],
  providers: [...docenteProviders],
  exports: [...docenteProviders],
})
export class DocenteRepositoryModule {}
