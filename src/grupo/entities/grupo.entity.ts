import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Asignatura } from '../../asignatura/entities/asignatura.entity';
import { Docente } from '../../docente/entities/docente.entity';
import { Alumno } from '../../alumno/entities/alumno.entity';

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

  @ManyToMany(() => Alumno)
  @JoinTable({
    name: 'inscripciones_grupo',
    joinColumn: {
      name: 'grupo_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'alumno_id',
      referencedColumnName: 'id',
    },
  })
  alumnos: Alumno[];

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
