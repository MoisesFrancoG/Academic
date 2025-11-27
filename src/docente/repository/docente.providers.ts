import { DataSource } from 'typeorm';
import { Docente } from '../entities/docente.entity';
import { Asignatura } from '../../asignatura/entities/asignatura.entity';
import { DocenteRepository } from './docente.repository';

/**
 * Providers para el repositorio de Docente
 * Configura la inyección de dependencias para TypeORM y el repositorio personalizado
 */
export const docenteProviders = [
  {
    provide: 'DOCENTE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Docente),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ASIGNATURA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Asignatura),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'IDocenteRepository',
    useClass: DocenteRepository,
  },
];
