import { DataSource } from 'typeorm';
import { ProgramaEstudio } from '../entities/programa-estudio.entity';
import { ProgramaEstudioRepository } from './programa-estudio.repository';

/**
 * Providers para el repositorio de Programa de Estudio
 * Define cómo se debe inyectar el repositorio en la aplicación
 */
export const programaEstudioProviders = [
  // Provider para el repositorio de TypeORM
  {
    provide: 'PROGRAMA_ESTUDIO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProgramaEstudio),
    inject: ['DATA_SOURCE'],
  },
  // Provider para la interfaz del repositorio personalizado
  {
    provide: 'IProgramaEstudioRepository',
    useClass: ProgramaEstudioRepository,
  },
];
