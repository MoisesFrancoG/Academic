import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Alumno } from '../entities/alumno.entity';
import { CreateAlumnoDto, UpdateAlumnoDto } from '../DTOs';
import type { IAlumnoRepository } from '../repository/alumno.repository.interface';

/**
 * Servicio de lógica de negocio para Alumno
 * Depende SOLO de la interfaz IAlumnoRepository
 * No conoce la implementación concreta (AlumnoRepository)
 * Esto permite total desacoplamiento y facilita testing
 */
@Injectable()
export class AlumnoService {
  constructor(
    @Inject('IAlumnoRepository')
    private readonly alumnoRepository: IAlumnoRepository,
  ) {}

  /**
   * Crea un nuevo alumno
   * @param createDto - Datos para crear el alumno
   * @returns Alumno creado
   * @throws ConflictException si ya existe un alumno con la misma matrícula
   */
  async create(createDto: CreateAlumnoDto): Promise<Alumno> {
    try {
      // Validar unicidad de la matrícula
      const existe = await this.alumnoRepository.existsByMatricula(
        createDto.matricula,
      );

      if (existe) {
        throw new ConflictException(
          `Ya existe un alumno con la matrícula "${createDto.matricula}"`,
        );
      }

      return await this.alumnoRepository.create(createDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el alumno');
    }
  }

  /**
   * Obtiene todos los alumnos
   * @returns Lista de alumnos
   */
  async findAll(): Promise<Alumno[]> {
    return await this.alumnoRepository.findAll();
  }

  /**
   * Obtiene un alumno por su ID
   * @param id - ID del alumno a buscar
   * @returns Alumno encontrado
   * @throws NotFoundException si no se encuentra el alumno
   */
  async findOne(id: string): Promise<Alumno> {
    const alumno = await this.alumnoRepository.findById(id);

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    return alumno;
  }

  /**
   * Busca un alumno por su matrícula
   * @param matricula - Matrícula del alumno
   * @returns Alumno encontrado
   * @throws NotFoundException si no se encuentra el alumno
   */
  async findByMatricula(matricula: string): Promise<Alumno> {
    const alumno = await this.alumnoRepository.findByMatricula(matricula);

    if (!alumno) {
      throw new NotFoundException(
        `Alumno con matrícula "${matricula}" no encontrado`,
      );
    }

    return alumno;
  }

  /**
   * Busca alumnos por cuatrimestre actual
   * @param cuatrimestre - Número de cuatrimestre
   * @returns Lista de alumnos del cuatrimestre
   */
  async findByCuatrimestre(cuatrimestre: number): Promise<Alumno[]> {
    return await this.alumnoRepository.findByCuatrimestre(cuatrimestre);
  }

  /**
   * Actualiza un alumno existente
   * Marca automáticamente sincronizado = false (Regla A)
   * @param id - ID del alumno a actualizar
   * @param updateDto - Datos a actualizar
   * @returns Alumno actualizado
   * @throws NotFoundException si no se encuentra el alumno
   * @throws ConflictException si la nueva matrícula ya existe
   */
  async update(id: string, updateDto: UpdateAlumnoDto): Promise<Alumno> {
    // Verificar que el alumno existe
    const alumno = await this.findOne(id);

    // Si se está actualizando la matrícula, verificar unicidad
    if (updateDto.matricula && updateDto.matricula !== alumno.matricula) {
      const existe = await this.alumnoRepository.existsByMatriculaExcludingId(
        updateDto.matricula,
        id,
      );

      if (existe) {
        throw new ConflictException(
          `Ya existe un alumno con la matrícula "${updateDto.matricula}"`,
        );
      }
    }

    // Regla A: El repositorio marca automáticamente sincronizado = false
    return await this.alumnoRepository.update(id, updateDto);
  }

  /**
   * Elimina un alumno (Soft Delete con Regla B)
   * Marca deletedAt y sincronizado = false para notificar al Orquestador
   * @param id - ID del alumno a eliminar
   * @throws NotFoundException si no se encuentra el alumno
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verifica que existe

    // Regla B: Soft Delete Manual - usar update con deletedAt
    await this.alumnoRepository.update(id, {
      deletedAt: new Date(),
      sincronizado: false,
    } as Partial<Alumno>);
  }

  /**
   * Cuenta el total de alumnos
   * @returns Cantidad total de alumnos
   */
  async count(): Promise<number> {
    return await this.alumnoRepository.count();
  }
}
