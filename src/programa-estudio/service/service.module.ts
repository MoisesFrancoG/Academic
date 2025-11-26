import { Module } from '@nestjs/common';
import { ProgramaEstudioService } from './programa-estudio.service';
import { ProgramaEstudioRepositoryModule } from '../repository/repository.module';

/**
 * Módulo de servicio de Programa de Estudio
 * Exporta el servicio para uso en controladores
 */
@Module({
  imports: [ProgramaEstudioRepositoryModule],
  providers: [ProgramaEstudioService],
  exports: [ProgramaEstudioService],
})
export class ServiceModule {}
