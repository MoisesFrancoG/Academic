import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { GrupoRepositoryModule } from '../repository/repository.module';
import { AsignaturaRepositoryModule } from '../../asignatura/repository/repository.module';
import { DocenteRepositoryModule } from '../../docente/repository/repository.module';
import { AlumnoRepositoryModule } from '../../alumno/repository/repository.module';

@Module({
  imports: [
    GrupoRepositoryModule,
    AsignaturaRepositoryModule,
    DocenteRepositoryModule,
    AlumnoRepositoryModule,
  ],
  providers: [GrupoService],
  exports: [GrupoService],
})
export class GrupoServiceModule {}
