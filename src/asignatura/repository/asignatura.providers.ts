import { DataSource } from 'typeorm';
import { Asignatura } from '../entities/asignatura.entity';
import { AsignaturaRepository } from './asignatura.repository';

/**
 * Providers para el repositorio de Asignatura
 * Configura la inyección de dependencias para TypeORM y el repositorio personalizado
 */
export const asignaturaProviders = [
  {
    provide: 'ASIGNATURA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Asignatura),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'IAsignaturaRepository',
    useClass: AsignaturaRepository,
  },
];
