import { Module } from '@nestjs/common';
import { DocenteRepositoryModule } from '../repository/repository.module';
import { AsignaturaRepositoryModule } from '../../asignatura/repository/repository.module';
import { DocenteService } from './docente.service';

/**
 * Módulo del servicio de Docente
 * Importa los repositorios necesarios y exporta el servicio
 */
@Module({
  imports: [DocenteRepositoryModule, AsignaturaRepositoryModule],
  providers: [DocenteService],
  exports: [DocenteService],
})
export class DocenteServiceModule {}
