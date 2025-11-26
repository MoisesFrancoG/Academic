import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { programaEstudioProviders } from './programa-estudio.providers';

/**
 * Módulo de repositorio de Programa de Estudio
 * Exporta los providers del repositorio para uso en otros módulos
 */
@Module({
  imports: [DatabaseModule],
  providers: [...programaEstudioProviders],
  exports: [...programaEstudioProviders],
})
export class ProgramaEstudioRepositoryModule {}
