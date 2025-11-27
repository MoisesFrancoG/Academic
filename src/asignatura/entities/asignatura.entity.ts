import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ProgramaEstudio } from '../../programa-estudio/entities/programa-estudio.entity';
import { Grupo } from '../../grupo/entities/grupo.entity';

/**
 * Entidad que representa una Asignatura (Materia)
 * Tabla: asignatura
 */
@Entity('asignatura')
export class Asignatura {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'ID único de la asignatura',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Nombre de la asignatura',
  })
  nombre: string;

  @Column({
    type: 'int',
    nullable: false,
    comment: 'Cuatrimestre en el que se imparte la asignatura',
  })
  cuatrimestre: number;

  @Column({
    type: 'uuid',
    name: 'programa_estudio_id',
    comment: 'ID del programa de estudio al que pertenece',
  })
  programaEstudioId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => ProgramaEstudio, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'programa_estudio_id' })
  programaEstudio: ProgramaEstudio;

  @OneToMany(() => Grupo, (grupo) => grupo.asignatura)
  grupos: Grupo[];
}
