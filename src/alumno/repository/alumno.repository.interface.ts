import { Alumno } from '../entities/alumno.entity';
import { CreateAlumnoDto } from '../DTOs/create-alumno.dto';
import { UpdateAlumnoDto } from '../DTOs/update-alumno.dto';

/**
 * Interfaz del repositorio de Alumno
 * Define el contrato que debe cumplir cualquier implementación del repositorio
 * Esto permite desacoplar la lógica de negocio de la implementación específica de TypeORM
 */
export interface IAlumnoRepository {
  /**
   * Crea un nuevo alumno
   */
  create(createDto: CreateAlumnoDto): Promise<Alumno>;

  /**
   * Obtiene todos los alumnos
   */
  findAll(): Promise<Alumno[]>;

  /**
   * Busca un alumno por su ID
   */
  findById(id: string): Promise<Alumno | null>;

  /**
   * Busca un alumno por su matrícula
   */
  findByMatricula(matricula: string): Promise<Alumno | null>;

  /**
   * Busca alumnos por cuatrimestre actual
   */
  findByCuatrimestre(cuatrimestre: number): Promise<Alumno[]>;

  /**
   * Actualiza un alumno existente
   * Marca automáticamente sincronizado = false
   */
  update(
    id: string,
    updateDto: UpdateAlumnoDto | Partial<Alumno>,
  ): Promise<Alumno>;

  /**
   * Elimina un alumno
   */
  delete(id: string): Promise<void>;

  /**
   * Elimina lógicamente un alumno (Soft Delete)
   * Marca deletedAt y sincronizado = false para que el Orquestador procese la baja
   * @param id - UUID del alumno
   * @returns true si se marcó como eliminado
   */
  softDelete(id: string): Promise<boolean>;

  /**
   * Cuenta el total de alumnos
   */
  count(): Promise<number>;

  /**
   * Verifica si existe un alumno con la matrícula dada
   */
  existsByMatricula(matricula: string): Promise<boolean>;

  /**
   * Verifica si existe un alumno con la matrícula dada, excluyendo un ID específico
   */
  existsByMatriculaExcludingId(
    matricula: string,
    excludeId: string,
  ): Promise<boolean>;

  /**
   * Obtiene alumnos no sincronizados (para Orquestador)
   * sincronizado = false AND deletedAt IS NULL
   */
  findUnsynchronized(): Promise<Alumno[]>;

  /**
   * Obtiene alumnos eliminados no sincronizados (para Orquestador)
   * sincronizado = false AND deletedAt IS NOT NULL
   */
  findDeletedUnsynchronized(): Promise<Alumno[]>;
}
