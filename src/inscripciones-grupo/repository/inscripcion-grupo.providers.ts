import { DataSource } from 'typeorm';
import { InscripcionGrupo } from '../entities/inscripcion-grupo.entity';

/**
 * Provider para inyectar el repositorio TypeORM de InscripcionGrupo
 */
export const inscripcionGrupoProviders = [
  {
    provide: 'INSCRIPCION_GRUPO_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(InscripcionGrupo),
    inject: ['DATA_SOURCE'],
  },
];
