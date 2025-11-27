import { Docente } from '../entities/docente.entity';
import { CreateDocenteDto } from '../DTOs/create-docente.dto';
import { UpdateDocenteDto } from '../DTOs/update-docente.dto';

/**
 * Interfaz del repositorio de Docente
 * Define el contrato que debe cumplir cualquier implementación del repositorio
 * Esto permite desacoplar la lógica de negocio de la implementación específica de TypeORM
 */
export interface IDocenteRepository {
  /**
   * Crea un nuevo docente
   */
  create(createDto: CreateDocenteDto): Promise<Docente>;

  /**
   * Obtiene todos los docentes
   */
  findAll(): Promise<Docente[]>;

  /**
   * Busca un docente por su ID
   */
  findById(id: string): Promise<Docente | null>;

  /**
   * Busca un docente por su ID con relaciones cargadas
   */
  findByIdWithRelations(id: string): Promise<Docente | null>;

  /**
   * Busca docentes que pueden impartir una asignatura específica
   */
  findByAsignaturaCompetencia(asignaturaId: string): Promise<Docente[]>;

  /**
   * Actualiza un docente existente
   */
  update(id: string, updateDto: UpdateDocenteDto): Promise<Docente>;

  /**
   * Elimina un docente
   */
  delete(id: string): Promise<void>;

  /**
   * Cuenta el total de docentes
   */
  count(): Promise<number>;

  /**
   * Agrega una competencia (asignatura) a un docente
   */
  addCompetencia(docenteId: string, asignaturaId: string): Promise<void>;

  /**
   * Remueve una competencia (asignatura) de un docente
   */
  removeCompetencia(docenteId: string, asignaturaId: string): Promise<void>;

  /**
   * Actualiza las competencias de un docente (reemplaza todas)
   */
  updateCompetencias(docenteId: string, asignaturaIds: string[]): Promise<void>;
}
