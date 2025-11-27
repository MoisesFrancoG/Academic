import { Asignatura } from '../entities/asignatura.entity';
import { CreateAsignaturaDto } from '../DTOs/create-asignatura.dto';
import { UpdateAsignaturaDto } from '../DTOs/update-asignatura.dto';

/**
 * Interfaz del repositorio de Asignatura
 * Define el contrato que debe cumplir cualquier implementación del repositorio
 * Esto permite desacoplar la lógica de negocio de la implementación específica de TypeORM
 */
export interface IAsignaturaRepository {
  /**
   * Crea una nueva asignatura
   */
  create(createDto: CreateAsignaturaDto): Promise<Asignatura>;

  /**
   * Obtiene todas las asignaturas
   */
  findAll(): Promise<Asignatura[]>;

  /**
   * Busca una asignatura por su ID
   */
  findById(id: string): Promise<Asignatura | null>;

  /**
   * Busca asignaturas por programa de estudio
   */
  findByProgramaEstudio(programaEstudioId: string): Promise<Asignatura[]>;

  /**
   * Busca asignaturas por cuatrimestre
   */
  findByCuatrimestre(cuatrimestre: number): Promise<Asignatura[]>;

  /**
   * Busca asignaturas por cuatrimestre y programa de estudio
   */
  findByCuatrimestreAndPrograma(
    cuatrimestre: number,
    programaEstudioId: string,
  ): Promise<Asignatura[]>;

  /**
   * Actualiza una asignatura existente
   */
  update(id: string, updateDto: UpdateAsignaturaDto): Promise<Asignatura>;

  /**
   * Elimina una asignatura
   */
  delete(id: string): Promise<void>;

  /**
   * Cuenta el total de asignaturas
   */
  count(): Promise<number>;

  /**
   * Cuenta asignaturas por programa de estudio
   */
  countByProgramaEstudio(programaEstudioId: string): Promise<number>;
}
