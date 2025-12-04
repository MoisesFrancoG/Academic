import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Grupo } from '../../grupo/entities/grupo.entity';
import { Alumno } from '../../alumno/entities/alumno.entity';

/**
 * Entidad que representa una inscripción de un alumno a un grupo
 * Reemplaza la tabla pivot automática de TypeORM para soportar:
 * - Soft Delete (detectar des-inscripciones para Moodle)
 * - Campo sincronizado (Dirty Flag para el Orquestador)
 * - Timestamps de auditoría
 * Tabla: inscripciones_grupo
 */
@Entity('inscripciones_grupo')
export class InscripcionGrupo {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'ID único de la inscripción',
  })
  id: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'grupo_id',
    comment: 'ID del grupo',
  })
  grupoId: string;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'alumno_id',
    comment: 'ID del alumno',
  })
  alumnoId: string;

  @Column({
    type: 'boolean',
    default: false,
    comment:
      'Bandera de sincronización con Moodle. false = pendiente de sincronizar',
  })
  sincronizado: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
    comment: 'Fecha de creación de la inscripción',
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
    comment:
      'Fecha de eliminación lógica (Soft Delete). Usado para desmatricular en Moodle',
  })
  deletedAt?: Date;

  // Relaciones
  @ManyToOne(() => Grupo, (grupo) => grupo.inscripciones, { 
    nullable: false,
    onDelete: 'CASCADE', // Borrado en cascada cuando se elimina el Grupo
  })
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;

  @ManyToOne(() => Alumno, (alumno) => alumno.inscripciones, {
    nullable: false,
    onDelete: 'CASCADE', // Borrado en cascada cuando se elimina el Alumno
  })
  @JoinColumn({ name: 'alumno_id' })
  alumno: Alumno;
}
