import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Docente } from '../entities/docente.entity';
import { CreateDocenteDto, UpdateDocenteDto } from '../DTOs';
import type { IDocenteRepository } from '../repository/docente.repository.interface';
import type { IAsignaturaRepository } from '../../asignatura/repository/asignatura.repository.interface';

/**
 * Servicio de lógica de negocio para Docente
 * Depende SOLO de las interfaces de repositorios
 * No conoce las implementaciones concretas
 * Esto permite total desacoplamiento y facilita testing
 */
@Injectable()
export class DocenteService {
  constructor(
    @Inject('IDocenteRepository')
    private readonly docenteRepository: IDocenteRepository,
    @Inject('IAsignaturaRepository')
    private readonly asignaturaRepository: IAsignaturaRepository,
  ) {}

  /**
   * Crea un nuevo docente
   * @param createDto - Datos para crear el docente
   * @returns Docente creado
   * @throws NotFoundException si alguna asignatura no existe
   */
  async create(createDto: CreateDocenteDto): Promise<Docente> {
    try {
      // Validar que todas las asignaturas existen
      if (
        createDto.asignaturasCompetenciaIds &&
        createDto.asignaturasCompetenciaIds.length > 0
      ) {
        await this.validateAsignaturas(createDto.asignaturasCompetenciaIds);
      }

      return await this.docenteRepository.create(createDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el docente');
    }
  }

  /**
   * Obtiene todos los docentes
   * @returns Lista de docentes con sus competencias
   */
  async findAll(): Promise<Docente[]> {
    return await this.docenteRepository.findAll();
  }

  /**
   * Obtiene un docente por su ID
   * @param id - ID del docente a buscar
   * @returns Docente encontrado
   * @throws NotFoundException si no se encuentra el docente
   */
  async findOne(id: string): Promise<Docente> {
    const docente = await this.docenteRepository.findByIdWithRelations(id);

    if (!docente) {
      throw new NotFoundException(`Docente con ID ${id} no encontrado`);
    }

    return docente;
  }

  /**
   * Busca docentes que pueden impartir una asignatura
   * @param asignaturaId - UUID de la asignatura
   * @returns Lista de docentes competentes
   */
  async findByAsignaturaCompetencia(asignaturaId: string): Promise<Docente[]> {
    // Validar que la asignatura existe
    const asignatura = await this.asignaturaRepository.findById(asignaturaId);
    if (!asignatura) {
      throw new NotFoundException(
        `Asignatura con ID ${asignaturaId} no encontrada`,
      );
    }

    return await this.docenteRepository.findByAsignaturaCompetencia(
      asignaturaId,
    );
  }

  /**
   * Actualiza un docente existente
   * @param id - ID del docente a actualizar
   * @param updateDto - Datos a actualizar
   * @returns Docente actualizado
   * @throws NotFoundException si no se encuentra el docente o alguna asignatura
   */
  async update(id: string, updateDto: UpdateDocenteDto): Promise<Docente> {
    // Verificar que el docente existe
    await this.findOne(id);

    // Validar asignaturas si se proporcionan
    if (
      updateDto.asignaturasCompetenciaIds &&
      updateDto.asignaturasCompetenciaIds.length > 0
    ) {
      await this.validateAsignaturas(updateDto.asignaturasCompetenciaIds);
    }

    return await this.docenteRepository.update(id, updateDto);
  }

  /**
   * Elimina un docente (Soft Delete con Regla B)
   * Marca deletedAt y sincronizado = false para notificar al Orquestador
   * @param id - ID del docente a eliminar
   * @throws NotFoundException si no se encuentra el docente
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verifica que existe

    // Regla B: Soft Delete Manual - usar update con deletedAt
    await this.docenteRepository.update(id, {
      deletedAt: new Date(),
      sincronizado: false,
    } as Partial<Docente>);
  }

  /**
   * Cuenta el total de docentes
   * @returns Cantidad total de docentes
   */
  async count(): Promise<number> {
    return await this.docenteRepository.count();
  }

  /**
   * Agrega una competencia a un docente
   * @param docenteId - UUID del docente
   * @param asignaturaId - UUID de la asignatura
   */
  async addCompetencia(docenteId: string, asignaturaId: string): Promise<void> {
    // Validar que ambos existen
    await this.findOne(docenteId);
    const asignatura = await this.asignaturaRepository.findById(asignaturaId);
    if (!asignatura) {
      throw new NotFoundException(
        `Asignatura con ID ${asignaturaId} no encontrada`,
      );
    }

    await this.docenteRepository.addCompetencia(docenteId, asignaturaId);
  }

  /**
   * Remueve una competencia de un docente
   * @param docenteId - UUID del docente
   * @param asignaturaId - UUID de la asignatura
   */
  async removeCompetencia(
    docenteId: string,
    asignaturaId: string,
  ): Promise<void> {
    await this.findOne(docenteId); // Valida que existe
    await this.docenteRepository.removeCompetencia(docenteId, asignaturaId);
  }

  /**
   * Actualiza las competencias de un docente (reemplaza todas)
   * @param docenteId - UUID del docente
   * @param asignaturaIds - Array de UUIDs de asignaturas
   */
  async updateCompetencias(
    docenteId: string,
    asignaturaIds: string[],
  ): Promise<void> {
    await this.findOne(docenteId); // Valida que existe

    if (asignaturaIds.length > 0) {
      await this.validateAsignaturas(asignaturaIds);
    }

    await this.docenteRepository.updateCompetencias(docenteId, asignaturaIds);
  }

  /**
   * Valida que todas las asignaturas existen
   * @param asignaturaIds - Array de UUIDs
   * @throws NotFoundException si alguna asignatura no existe
   */
  private async validateAsignaturas(asignaturaIds: string[]): Promise<void> {
    for (const asignaturaId of asignaturaIds) {
      const asignatura = await this.asignaturaRepository.findById(asignaturaId);
      if (!asignatura) {
        throw new NotFoundException(
          `Asignatura con ID ${asignaturaId} no encontrada`,
        );
      }
    }
  }
}
