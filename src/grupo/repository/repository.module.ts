import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { grupoProviders } from './grupo.providers';
import { GrupoRepository } from './grupo.repository';
import { inscripcionGrupoProviders } from '../../inscripciones-grupo/repository/inscripcion-grupo.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...grupoProviders,
    ...inscripcionGrupoProviders,
    {
      provide: 'IGrupoRepository',
      useClass: GrupoRepository,
    },
  ],
  exports: ['IGrupoRepository', ...grupoProviders],
})
export class GrupoRepositoryModule {}
