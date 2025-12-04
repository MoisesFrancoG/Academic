import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Asignatura } from '../../asignatura/entities/asignatura.entity';

/**
 * Entidad que representa un Programa de Estudio (Carrera)
 * Tabla: programa_estudio
 */
@Entity('programa_estudio')
export class ProgramaEstudio {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'ID único del programa de estudio',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
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

  @Column({
    type: 'boolean',
    default: false,
    comment:
      'Bandera de sincronización con Moodle. false = pendiente de sincronizar',
  })
  sincronizado: boolean;

  @Column({
    type: 'int',
    nullable: true,
    name: 'moodle_category_id',
    comment: 'ID de la categoría en Moodle',
  })
  moodleCategoryId: number | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
    comment:
      'Fecha de eliminación lógica (Soft Delete). Usado para eliminar en Moodle',
  })
  deletedAt?: Date;

  // Relaciones
  @OneToMany(() => Asignatura, (asignatura) => asignatura.programaEstudio)
  asignaturas: Asignatura[];
}
