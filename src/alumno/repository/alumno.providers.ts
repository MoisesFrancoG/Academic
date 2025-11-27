import { DataSource } from 'typeorm';
import { Alumno } from '../entities/alumno.entity';
import { AlumnoRepository } from './alumno.repository';

/**
 * Providers para el repositorio de Alumno
 * Configura la inyección de dependencias para TypeORM y el repositorio personalizado
 */
export const alumnoProviders = [
  {
    provide: 'ALUMNO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Alumno),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'IAlumnoRepository',
    useClass: AlumnoRepository,
  },
];
