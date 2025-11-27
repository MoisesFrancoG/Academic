import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { grupoProviders } from './grupo.providers';
import { GrupoRepository } from './grupo.repository';
import { alumnoProviders } from '../../alumno/repository/alumno.providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...grupoProviders,
    ...alumnoProviders,
    {
      provide: 'IGrupoRepository',
      useClass: GrupoRepository,
    },
  ],
  exports: ['IGrupoRepository'],
})
export class GrupoRepositoryModule {}
