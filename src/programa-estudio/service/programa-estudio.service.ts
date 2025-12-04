import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProgramaEstudio } from '../entities/programa-estudio.entity';
import { CreateProgramaEstudioDto, UpdateProgramaEstudioDto } from '../DTOs';
import type { IProgramaEstudioRepository } from '../repository/programa-estudio.repository.interface';

/**
 * Servicio de lógica de negocio para Programa de Estudio
 * Depende SOLO de la interfaz IProgramaEstudioRepository
 * No conoce la implementación concreta (ProgramaEstudioRepository)
 * Esto permite total desacoplamiento y facilita testing
 */
@Injectable()
export class ProgramaEstudioService {
  constructor(
    @Inject('IProgramaEstudioRepository')
    private readonly programaEstudioRepository: IProgramaEstudioRepository,
  ) {}

  /**
   * Crea un nuevo programa de estudio
   * @param createDto - Datos para crear el programa
   * @returns Programa de estudio creado
   * @throws ConflictException si ya existe un programa con el mismo nombre
   */
  async create(createDto: CreateProgramaEstudioDto): Promise<ProgramaEstudio> {
    try {
      // Validar unicidad del nombre
      const existe = await this.programaEstudioRepository.existsByNombre(
        createDto.nombre,
      );

      if (existe) {
        throw new ConflictException(
          `Ya existe un programa de estudio con el nombre "${createDto.nombre}"`,
        );
      }

      return await this.programaEstudioRepository.create(createDto);
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
    return await this.programaEstudioRepository.findAll();
  }

  /**
   * Obtiene un programa de estudio por su ID
   * @param id - ID del programa a buscar
   * @returns Programa de estudio encontrado
   * @throws NotFoundException si no se encuentra el programa
   */
  async findOne(id: string): Promise<ProgramaEstudio> {
    const programa = await this.programaEstudioRepository.findById(id);

    if (!programa) {
      throw new NotFoundException(
        `Programa de estudio con ID ${id} no encontrado`,
      );
    }

    return programa;
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
    id: string,
    updateDto: UpdateProgramaEstudioDto,
  ): Promise<ProgramaEstudio> {
    // Verificar que el programa existe
    const programa = await this.findOne(id);

    // Si se está actualizando el nombre, verificar unicidad
    if (updateDto.nombre && updateDto.nombre !== programa.nombre) {
      const existe = await this.programaEstudioRepository.existsByNombre(
        updateDto.nombre,
      );

      if (existe) {
        throw new ConflictException(
          `Ya existe un programa de estudio con el nombre "${updateDto.nombre}"`,
        );
      }
    }

    return await this.programaEstudioRepository.update(id, updateDto);
  }

  /**
   * Elimina un programa de estudio (Soft Delete con Regla B)
   * Marca deletedAt y sincronizado = false para notificar al Orquestador
   * @param id - ID del programa a eliminar
   * @throws NotFoundException si no se encuentra el programa
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verifica que existe

    // Regla B: Soft Delete Manual - usar update con deletedAt
    await this.programaEstudioRepository.update(id, {
      deletedAt: new Date(),
      sincronizado: false,
    } as Partial<ProgramaEstudio>);
  }

  /**
   * Cuenta el total de programas de estudio
   * @returns Cantidad total de programas
   */
  async count(): Promise<number> {
    return await this.programaEstudioRepository.count();
  }

  /**
   * Busca programas por cantidad de cuatrimestres
   */
  async findByCantidadCuatrimestres(
    cantidad: number,
  ): Promise<ProgramaEstudio[]> {
    return await this.programaEstudioRepository.findByCantidadCuatrimestres(
      cantidad,
    );
  }

  /**
   * Confirma la sincronización exitosa con Moodle
   * Actualiza el moodleCategoryId y marca sincronizado = true
   * @param id - ID del programa
   * @param moodleCategoryId - ID de la categoría en Moodle
   * @throws NotFoundException si no se encuentra el programa
   * IMPORTANTE: Usa save() directo para evitar que el Dirty Flag resetee sincronizado a false
   * CRÍTICO: Incluye withDeleted para poder confirmar bajas (soft deletes)
   */
  async confirmMoodleSync(
    id: string,
    moodleCategoryId: number,
  ): Promise<ProgramaEstudio> {
    // CRÍTICO: Agregar 'withDeleted: true' para poder actualizar registros borrados
    const programa = await this.programaEstudioRepository['repository'].findOne({
      where: { id },
      withDeleted: true,
    });

    if (!programa) {
      throw new NotFoundException(`Programa de Estudio con ID ${id} no encontrado`);
    }

    // Actualizar campos manualmente y guardar directamente
    // Esto evita pasar por repository.update() que fuerza sincronizado = false
    programa.moodleCategoryId = moodleCategoryId;
    programa.sincronizado = true;

    // Save directo en el repositorio TypeORM (bypass del método update personalizado)
    const updated = await this.programaEstudioRepository['repository'].save(programa);
    return updated;
  }

  /**
   * Obtiene programas pendientes de sincronización
   * Retorna programas con sincronizado = false y deletedAt = null
   * @returns Lista de programas pendientes
   */
  async findPendingSync(): Promise<ProgramaEstudio[]> {
    return await this.programaEstudioRepository.findUnsynchronized();
  }

  /**
   * Obtiene programas eliminados pendientes de sincronización
   * Retorna programas con sincronizado = false y deletedAt != null
   * @returns Lista de programas eliminados pendientes
   */
  async findDeletedPendingSync(): Promise<ProgramaEstudio[]> {
    return await this.programaEstudioRepository.findDeletedUnsynchronized();
  }
}
