import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Asignatura } from '../../asignatura/entities/asignatura.entity';
import { Docente } from '../../docente/entities/docente.entity';
import { InscripcionGrupo } from '../../inscripciones-grupo/entities/inscripcion-grupo.entity';

/**
 * Entidad que representa un Grupo
 * Entidad central que conecta Asignatura, Docente y Alumnos
 * Tabla: grupo
 */
@Entity('grupo')
export class Grupo {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'ID único del grupo',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Nombre del grupo (ej: 9A, 1B)',
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'asignatura_nombre_snapshot',
    comment:
      'Snapshot del nombre de la asignatura al momento de crear el grupo',
  })
  asignaturaNombreSnapshot: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'docente_nombre_snapshot',
    comment: 'Snapshot del nombre del docente al momento de asignar al grupo',
  })
  docenteNombreSnapshot: string;

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
  @Column({
    type: 'uuid',
    nullable: false,
    name: 'asignatura_id',
  })
  asignaturaId: string;

  @ManyToOne(() => Asignatura)
  @JoinColumn({ name: 'asignatura_id' })
  asignatura: Asignatura;

  @Column({
    type: 'uuid',
    nullable: false,
    name: 'docente_id',
  })
  docenteId: string;

  @ManyToOne(() => Docente)
  @JoinColumn({ name: 'docente_id' })
  docente: Docente;

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
    name: 'moodle_course_id',
    comment: 'ID del curso en Moodle',
  })
  moodleCourseId: number | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    select: false,
    comment:
      'Fecha de eliminación lógica (Soft Delete). Usado para eliminar en Moodle',
  })
  deletedAt?: Date;

  // Relación OneToMany con inscripciones (reemplaza ManyToMany)
  @OneToMany(() => InscripcionGrupo, (inscripcion) => inscripcion.grupo)
  inscripciones: InscripcionGrupo[];

  // Hooks para mantener los snapshots actualizados
  @BeforeInsert()
  @BeforeUpdate()
  updateSnapshots() {
    if (this.asignatura) {
      this.asignaturaNombreSnapshot = this.asignatura.nombre;
    }
    if (this.docente) {
      this.docenteNombreSnapshot = this.docente.nombre;
    }
  }
}
