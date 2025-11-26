import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad que representa un Programa de Estudio
 * Tabla: programa_estudio
 */
@Entity('programa_estudio')
export class ProgramaEstudio {
  @PrimaryGeneratedColumn('increment', {
    comment: 'ID autoincremental del programa de estudio',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Nombre del programa de estudio',
  })
  nombre: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'cantidad_cuatrimestres',
    comment: 'Cantidad de cuatrimestres que dura el programa',
  })
  cantidadCuatrimestres: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    comment: 'Fecha de creación del registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
    comment: 'Fecha de última actualización del registro',
  })
  updatedAt: Date;
}
