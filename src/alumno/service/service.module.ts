import { Module } from '@nestjs/common';
import { AlumnoRepositoryModule } from '../repository/repository.module';
import { AlumnoService } from './alumno.service';

/**
 * Módulo del servicio de Alumno
 * Importa el repositorio y exporta el servicio
 */
@Module({
  imports: [AlumnoRepositoryModule],
  providers: [AlumnoService],
  exports: [AlumnoService],
})
export class AlumnoServiceModule {}
