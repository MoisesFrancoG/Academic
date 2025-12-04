import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { InscripcionGrupo } from '../../inscripciones-grupo/entities/inscripcion-grupo.entity';

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
    name: 'moodle_user_id',
    comment: 'ID del usuario en Moodle',
  })
  moodleUserId: number | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
    comment:
      'Fecha de eliminación lógica (Soft Delete). Usado para eliminar en Moodle',
  })
  deletedAt?: Date;

  // Relación OneToMany con inscripciones (reemplaza ManyToMany)
  @OneToMany(() => InscripcionGrupo, (inscripcion) => inscripcion.alumno)
  inscripciones: InscripcionGrupo[];
}
