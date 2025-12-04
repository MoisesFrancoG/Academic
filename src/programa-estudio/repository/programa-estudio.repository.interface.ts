import { ProgramaEstudio } from '../entities/programa-estudio.entity';
import { CreateProgramaEstudioDto } from '../DTOs/create-programa-estudio.dto';
import { UpdateProgramaEstudioDto } from '../DTOs/update-programa-estudio.dto';

/**
 * Interfaz del repositorio de Programa de Estudio
 * Define el contrato que debe cumplir cualquier implementación del repositorio
 * Esto permite desacoplar la lógica de negocio de la implementación específica de TypeORM
 */
export interface IProgramaEstudioRepository {
  /**
   * Crea un nuevo programa de estudio
   */
  create(createDto: CreateProgramaEstudioDto): Promise<ProgramaEstudio>;

  /**
   * Obtiene todos los programas de estudio
   */
  findAll(): Promise<ProgramaEstudio[]>;

  /**
   * Busca un programa de estudio por su ID
   */
  findById(id: string): Promise<ProgramaEstudio | null>;

  /**
   * Busca un programa de estudio por su nombre
   */
  findByNombre(nombre: string): Promise<ProgramaEstudio | null>;

  /**
   * Actualiza un programa de estudio
   * Marca automáticamente sincronizado = false
   */
  update(
    id: string,
    updateDto: UpdateProgramaEstudioDto | Partial<ProgramaEstudio>,
  ): Promise<ProgramaEstudio>;

  /**
   * Elimina un programa de estudio
   */
  delete(id: string): Promise<void>;

  /**
   * Cuenta el total de programas de estudio
   */
  count(): Promise<number>;

  /**
   * Verifica si existe un programa con el nombre dado
   */
  existsByNombre(nombre: string): Promise<boolean>;

  /**
   * Busca programas por cantidad de cuatrimestres
   */
  findByCantidadCuatrimestres(cantidad: number): Promise<ProgramaEstudio[]>;
}
