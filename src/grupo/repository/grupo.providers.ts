import { DataSource } from 'typeorm';

export const grupoProviders = [
  {
    provide: 'GRUPO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository('Grupo'),
    inject: ['DATA_SOURCE'],
  },
];
