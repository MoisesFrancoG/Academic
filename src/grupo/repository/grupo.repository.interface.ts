import type { Grupo } from '../entities/grupo.entity';

/**
 * Interfaz para el repositorio de Grupo
 * Define el contrato de operaciones de acceso a datos
 */
export interface IGrupoRepository {
  /**
   * Crea un nuevo grupo en la base de datos
   * @param grupo - Datos del grupo a crear
   * @returns Grupo creado con ID generado
   */
  create(grupo: Grupo): Promise<Grupo>;

  /**
   * Encuentra un grupo por su UUID
   * @param id - UUID del grupo
   * @returns Grupo encontrado o null
   */
  findById(id: string): Promise<Grupo | null>;

  /**
   * Encuentra todos los grupos con sus relaciones
   * @returns Lista de todos los grupos
   */
  findAll(): Promise<Grupo[]>;

  /**
   * Actualiza un grupo existente
   * @param grupo - Grupo con datos actualizados
   * @returns Grupo actualizado
   */
  update(grupo: Grupo): Promise<Grupo>;

  /**
   * Elimina un grupo por su UUID
   * @param id - UUID del grupo a eliminar
   * @returns true si se eliminó, false si no se encontró
   */
  delete(id: string): Promise<boolean>;

  /**
   * Elimina lógicamente un grupo (Soft Delete)
   * Marca deletedAt y sincronizado = false para que el Orquestador procese la baja
   * @param id - UUID del grupo
   * @returns true si se marcó como eliminado
   */
  softDelete(id: string): Promise<boolean>;

  /**
   * Cuenta el total de grupos
   * @returns Número total de grupos
   */
  count(): Promise<number>;

  /**
   * Encuentra grupos por asignatura
   * @param asignaturaId - UUID de la asignatura
   * @returns Lista de grupos de la asignatura
   */
  findByAsignatura(asignaturaId: string): Promise<Grupo[]>;

  /**
   * Encuentra grupos por docente
   * @param docenteId - UUID del docente
   * @returns Lista de grupos del docente
   */
  findByDocente(docenteId: string): Promise<Grupo[]>;

  /**
   * Encuentra grupos en los que está inscrito un alumno
   * @param alumnoId - UUID del alumno
   * @returns Lista de grupos del alumno
   */
  findByAlumno(alumnoId: string): Promise<Grupo[]>;

  /**
   * Añade un alumno a un grupo
   * @param grupoId - UUID del grupo
   * @param alumnoId - UUID del alumno
   * @returns Grupo actualizado con el alumno añadido
   */
  addAlumno(grupoId: string, alumnoId: string): Promise<Grupo>;

  /**
   * Elimina un alumno de un grupo
   * @param grupoId - UUID del grupo
   * @param alumnoId - UUID del alumno
   * @returns Grupo actualizado sin el alumno
   */
  removeAlumno(grupoId: string, alumnoId: string): Promise<Grupo>;

  /**
   * Actualiza la lista completa de alumnos de un grupo
   * @param grupoId - UUID del grupo
   * @param alumnoIds - Lista de UUIDs de alumnos
   * @returns Grupo actualizado con nueva lista de alumnos
   */
  updateAlumnos(grupoId: string, alumnoIds: string[]): Promise<Grupo>;

  /**
   * Cuenta el número de alumnos en un grupo
   * @param grupoId - UUID del grupo
   * @returns Número de alumnos inscritos
   */
  countAlumnos(grupoId: string): Promise<number>;

  /**
   * Obtiene grupos no sincronizados (para Orquestador)
   * sincronizado = false AND deletedAt IS NULL
   */
  findUnsynchronized(): Promise<Grupo[]>;

  /**
   * Obtiene grupos eliminados no sincronizados (para Orquestador)
   * sincronizado = false AND deletedAt IS NOT NULL
   */
  findDeletedUnsynchronized(): Promise<Grupo[]>;
}
