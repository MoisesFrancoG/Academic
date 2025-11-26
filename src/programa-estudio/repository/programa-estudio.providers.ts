import { DataSource } from 'typeorm';
import { ProgramaEstudio } from '../entities/programa-estudio.entity';

/**
 * Provider del repositorio de Programa de Estudio
 * Inyecta el repositorio TypeORM para ser usado en los servicios
 */
export const programaEstudioProviders = [
  {
    provide: 'PROGRAMA_ESTUDIO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProgramaEstudio),
    inject: ['DATA_SOURCE'],
  },
];
