import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProgramaEstudio } from '../entities/programa-estudio.entity';
import { CreateProgramaEstudioDto, UpdateProgramaEstudioDto } from '../DTOs';

/**
 * Servicio que maneja la lógica de negocio de Programa de Estudio
 * Implementa operaciones CRUD completas
 */
@Injectable()
export class ProgramaEstudioService {
  constructor(
    @Inject('PROGRAMA_ESTUDIO_REPOSITORY')
    private programaEstudioRepository: Repository<ProgramaEstudio>,
  ) {}

  /**
   * Crea un nuevo programa de estudio
   * @param createDto - Datos para crear el programa
   * @returns Programa de estudio creado
   * @throws ConflictException si ya existe un programa con el mismo nombre
   */
  async create(createDto: CreateProgramaEstudioDto): Promise<ProgramaEstudio> {
    try {
      // Verificar si ya existe un programa con el mismo nombre
      const existente = await this.programaEstudioRepository.findOne({
        where: { nombre: createDto.nombre },
      });

      if (existente) {
        throw new ConflictException(
          `Ya existe un programa de estudio con el nombre "${createDto.nombre}"`,
        );
      }

      // Crear nueva instancia
      const programaEstudio = this.programaEstudioRepository.create(createDto);

      // Guardar en la base de datos
      return await this.programaEstudioRepository.save(programaEstudio);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al crear el programa de estudio',
      );
    }
  }

  /**
   * Obtiene todos los programas de estudio
   * @returns Lista de programas de estudio
   */
  async findAll(): Promise<ProgramaEstudio[]> {
    try {
      return await this.programaEstudioRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch {
      throw new InternalServerErrorException(
        'Error al obtener los programas de estudio',
      );
    }
  }

  /**
   * Obtiene un programa de estudio por su ID
   * @param id - ID del programa a buscar
   * @returns Programa de estudio encontrado
   * @throws NotFoundException si no se encuentra el programa
   */
  async findOne(id: number): Promise<ProgramaEstudio> {
    try {
      const programaEstudio = await this.programaEstudioRepository.findOne({
        where: { id },
      });

      if (!programaEstudio) {
        throw new NotFoundException(
          `Programa de estudio con ID ${id} no encontrado`,
        );
      }

      return programaEstudio;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al obtener el programa de estudio',
      );
    }
  }

  /**
   * Actualiza un programa de estudio existente
   * @param id - ID del programa a actualizar
   * @param updateDto - Datos a actualizar
   * @returns Programa de estudio actualizado
   * @throws NotFoundException si no se encuentra el programa
   * @throws ConflictException si el nuevo nombre ya existe
   */
  async update(
    id: number,
    updateDto: UpdateProgramaEstudioDto,
  ): Promise<ProgramaEstudio> {
    try {
      // Verificar que el programa existe
      const programaEstudio = await this.findOne(id);

      // Si se intenta cambiar el nombre, verificar que no exista otro con ese nombre
      if (updateDto.nombre && updateDto.nombre !== programaEstudio.nombre) {
        const existente = await this.programaEstudioRepository.findOne({
          where: { nombre: updateDto.nombre },
        });

        if (existente) {
          throw new ConflictException(
            `Ya existe un programa de estudio con el nombre "${updateDto.nombre}"`,
          );
        }
      }

      // Actualizar campos
      Object.assign(programaEstudio, updateDto);

      // Guardar cambios
      return await this.programaEstudioRepository.save(programaEstudio);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al actualizar el programa de estudio',
      );
    }
  }

  /**
   * Elimina un programa de estudio
   * @param id - ID del programa a eliminar
   * @throws NotFoundException si no se encuentra el programa
   */
  async remove(id: number): Promise<void> {
    try {
      // Verificar que existe
      const programaEstudio = await this.findOne(id);

      // Eliminar
      await this.programaEstudioRepository.remove(programaEstudio);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al eliminar el programa de estudio',
      );
    }
  }

  /**
   * Cuenta el total de programas de estudio
   * @returns Cantidad total de programas
   */
  async count(): Promise<number> {
    try {
      return await this.programaEstudioRepository.count();
    } catch {
      throw new InternalServerErrorException(
        'Error al contar los programas de estudio',
      );
    }
  }
}
