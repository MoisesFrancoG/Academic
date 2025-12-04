import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Asignatura } from '../../asignatura/entities/asignatura.entity';
import { Grupo } from '../../grupo/entities/grupo.entity';

/**
 * Entidad que representa un Docente (Profesor)
 * Tabla: docente
 */
@Entity('docente')
export class Docente {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'ID único del docente',
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    comment: 'Nombre completo del docente',
  })
  nombre: string;

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

  // Relaciones
  /**
   * Asignaturas que el docente está COMPETENTE para impartir
   * (Catálogo de materias que puede dar)
   */
  @ManyToMany(() => Asignatura, { cascade: true })
  @JoinTable({
    name: 'docente_competencias',
    joinColumn: { name: 'docente_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'asignatura_id', referencedColumnName: 'id' },
  })
  asignaturasCompetencia: Asignatura[];

  @OneToMany(() => Grupo, (grupo) => grupo.docente)
  grupos: Grupo[];
}
