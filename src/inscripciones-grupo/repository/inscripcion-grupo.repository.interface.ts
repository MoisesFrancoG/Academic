import { InscripcionGrupo } from '../entities/inscripcion-grupo.entity';
import { CreateInscripcionGrupoDto } from '../DTOs';

/**
 * Interfaz del repositorio de Inscripciones de Grupo
 * Define el contrato que debe cumplir cualquier implementación
 */
export interface IInscripcionGrupoRepository {
  /**
   * Crea una nueva inscripción
   */
  create(dto: CreateInscripcionGrupoDto): Promise<InscripcionGrupo>;

  /**
   * Busca una inscripción por ID
   */
  findById(id: string): Promise<InscripcionGrupo | null>;

  /**
   * Busca todas las inscripciones activas
   */
  findAll(): Promise<InscripcionGrupo[]>;

  /**
   * Busca inscripciones por grupo
   */
  findByGrupo(grupoId: string): Promise<InscripcionGrupo[]>;

  /**
   * Busca inscripciones por alumno
   */
  findByAlumno(alumnoId: string): Promise<InscripcionGrupo[]>;

  /**
   * Busca una inscripción específica (grupo + alumno)
   */
  findByGrupoAndAlumno(
    grupoId: string,
    alumnoId: string,
  ): Promise<InscripcionGrupo | null>;

  /**
   * Verifica si existe una inscripción activa
   */
  exists(grupoId: string, alumnoId: string): Promise<boolean>;

  /**
   * Elimina lógicamente una inscripción (Soft Delete)
   * Marca sincronizado = false para notificar al Orquestador
   */
  softDelete(id: string): Promise<InscripcionGrupo | null>;

  /**
   * Cuenta inscripciones activas en un grupo
   */
  countByGrupo(grupoId: string): Promise<number>;

  /**
   * Busca inscripciones no sincronizadas (para el Orquestador)
   */
  findUnsynchronized(): Promise<InscripcionGrupo[]>;

  /**
   * Busca inscripciones eliminadas no sincronizadas
   */
  findDeletedUnsynchronized(): Promise<InscripcionGrupo[]>;

  /**
   * Marca una inscripción como sincronizada
   */
  markAsSynchronized(id: string): Promise<void>;
}
