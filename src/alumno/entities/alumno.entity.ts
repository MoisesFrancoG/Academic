import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Grupo } from '../../grupo/entities/grupo.entity';

/**
 * Entidad que representa un Alumno (Estudiante)
 * Tabla: alumno
 */
@Entity('alumno')
export class Alumno {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'ID único del alumno',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Nombre completo del alumno',
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    comment: 'Matrícula única del alumno',
  })
  matricula: string;

  @Column({
    type: 'int',
    nullable: false,
    name: 'cuatrimestre_actual',
    comment: 'Cuatrimestre actual que está cursando el alumno',
  })
  cuatrimestreActual: number;

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
  @ManyToMany(() => Grupo, (grupo) => grupo.alumnos)
  grupos: Grupo[];
}
