import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Asignatura } from '../entities/asignatura.entity';
import { CreateAsignaturaDto, UpdateAsignaturaDto } from '../DTOs';
import type { IAsignaturaRepository } from '../repository/asignatura.repository.interface';
import type { IProgramaEstudioRepository } from '../../programa-estudio/repository/programa-estudio.repository.interface';
import type { IGrupoRepository } from '../../grupo/repository/grupo.repository.interface';
import { Repository } from 'typeorm';
import { Grupo } from '../../grupo/entities/grupo.entity';

/**
 * Servicio de lógica de negocio para Asignatura
 * Depende SOLO de las interfaces de repositorios
 * No conoce las implementaciones concretas
 * Esto permite total desacoplamiento y facilita testing
 */
@Injectable()
export class AsignaturaService {
  constructor(
    @Inject('IAsignaturaRepository')
    private readonly asignaturaRepository: IAsignaturaRepository,
    @Inject('IProgramaEstudioRepository')
    private readonly programaEstudioRepository: IProgramaEstudioRepository,
    @Inject('IGrupoRepository')
    private readonly grupoRepository: IGrupoRepository,
    @Inject('GRUPO_REPOSITORY')
    private readonly grupoRepo: Repository<Grupo>,
  ) {}

  /**
   * Crea una nueva asignatura
   * @param createDto - Datos para crear la asignatura
   * @returns Asignatura creada
   * @throws NotFoundException si el programa de estudio no existe
   * @throws BadRequestException si el cuatrimestre excede el límite del programa
   */
  async create(createDto: CreateAsignaturaDto): Promise<Asignatura> {
    try {
      // Validar que el programa de estudio existe
      const programaEstudio = await this.programaEstudioRepository.findById(
        createDto.programaEstudioId,
      );

      if (!programaEstudio) {
        throw new NotFoundException(
          `Programa de estudio con ID ${createDto.programaEstudioId} no encontrado`,
        );
      }

      // Validar que el cuatrimestre no exceda el límite del programa
      if (createDto.cuatrimestre > programaEstudio.cantidadCuatrimestres) {
        throw new BadRequestException(
          `El cuatrimestre ${createDto.cuatrimestre} excede el límite del programa "${programaEstudio.nombre}" (${programaEstudio.cantidadCuatrimestres} cuatrimestres)`,
        );
      }

      return await this.asignaturaRepository.create(createDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la asignatura');
    }
  }

  /**
   * Obtiene todas las asignaturas
   * @returns Lista de asignaturas
   */
  async findAll(): Promise<Asignatura[]> {
    return await this.asignaturaRepository.findAll();
  }

  /**
   * Obtiene una asignatura por su ID
   * @param id - ID de la asignatura a buscar
   * @returns Asignatura encontrada
   * @throws NotFoundException si no se encuentra la asignatura
   */
  async findOne(id: string): Promise<Asignatura> {
    const asignatura = await this.asignaturaRepository.findById(id);

    if (!asignatura) {
      throw new NotFoundException(`Asignatura con ID ${id} no encontrada`);
    }

    return asignatura;
  }

  /**
   * Busca asignaturas por programa de estudio
   * @param programaEstudioId - UUID del programa de estudio
   * @returns Lista de asignaturas del programa
   */
  async findByProgramaEstudio(
    programaEstudioId: string,
  ): Promise<Asignatura[]> {
    // Validar que el programa existe
    const programa =
      await this.programaEstudioRepository.findById(programaEstudioId);
    if (!programa) {
      throw new NotFoundException(
        `Programa de estudio con ID ${programaEstudioId} no encontrado`,
      );
    }

    return await this.asignaturaRepository.findByProgramaEstudio(
      programaEstudioId,
    );
  }

  /**
   * Busca asignaturas por cuatrimestre
   * @param cuatrimestre - Número de cuatrimestre
   * @returns Lista de asignaturas del cuatrimestre
   */
  async findByCuatrimestre(cuatrimestre: number): Promise<Asignatura[]> {
    return await this.asignaturaRepository.findByCuatrimestre(cuatrimestre);
  }

  /**
   * Busca asignaturas por cuatrimestre y programa de estudio
   * @param cuatrimestre - Número de cuatrimestre
   * @param programaEstudioId - UUID del programa de estudio
   * @returns Lista de asignaturas filtradas
   */
  async findByCuatrimestreAndPrograma(
    cuatrimestre: number,
    programaEstudioId: string,
  ): Promise<Asignatura[]> {
    return await this.asignaturaRepository.findByCuatrimestreAndPrograma(
      cuatrimestre,
      programaEstudioId,
    );
  }

  /**
   * Actualiza una asignatura existente
   * @param id - ID de la asignatura a actualizar
   * @param updateDto - Datos a actualizar
   * @returns Asignatura actualizada
   * @throws NotFoundException si no se encuentra la asignatura o el programa
   * @throws BadRequestException si el cuatrimestre excede el límite
   */
  /**
   * Actualiza una asignatura existente
   * Regla C: Si cambia el nombre, invalida la sincronización de los Grupos relacionados
   * @param id - ID de la asignatura a actualizar
   * @param updateDto - Datos a actualizar
   * @returns Asignatura actualizada
   * @throws NotFoundException si no se encuentra la asignatura o el programa
   * @throws BadRequestException si el cuatrimestre excede el límite
   */
  async update(
    id: string,
    updateDto: UpdateAsignaturaDto,
  ): Promise<Asignatura> {
    // Verificar que la asignatura existe
    const asignatura = await this.findOne(id);

    // Si se está actualizando el programa de estudio, validarlo
    if (updateDto.programaEstudioId) {
      const programaEstudio = await this.programaEstudioRepository.findById(
        updateDto.programaEstudioId,
      );

      if (!programaEstudio) {
        throw new NotFoundException(
          `Programa de estudio con ID ${updateDto.programaEstudioId} no encontrado`,
        );
      }

      // Validar cuatrimestre si se proporciona o usar el actual
      const cuatrimestre = updateDto.cuatrimestre ?? asignatura.cuatrimestre;
      if (cuatrimestre > programaEstudio.cantidadCuatrimestres) {
        throw new BadRequestException(
          `El cuatrimestre ${cuatrimestre} excede el límite del programa "${programaEstudio.nombre}" (${programaEstudio.cantidadCuatrimestres} cuatrimestres)`,
        );
      }
    } else if (updateDto.cuatrimestre) {
      // Si solo se actualiza el cuatrimestre, validar contra el programa actual
      const programaEstudio = await this.programaEstudioRepository.findById(
        asignatura.programaEstudioId,
      );

      if (
        programaEstudio &&
        updateDto.cuatrimestre > programaEstudio.cantidadCuatrimestres
      ) {
        throw new BadRequestException(
          `El cuatrimestre ${updateDto.cuatrimestre} excede el límite del programa "${programaEstudio.nombre}" (${programaEstudio.cantidadCuatrimestres} cuatrimestres)`,
        );
      }
    }

    // Actualizar la asignatura
    const updated = await this.asignaturaRepository.update(id, updateDto);

    // Regla C: Si cambió el nombre, marcar grupos hijos como no sincronizados
    if (updateDto.nombre && updateDto.nombre !== asignatura.nombre) {
      await this.grupoRepo.update(
        { asignatura: { id: id } },
        { sincronizado: false },
      );
    }

    return updated;
  }

  /**
   * Elimina una asignatura
   * @param id - ID de la asignatura a eliminar
   * @throws NotFoundException si no se encuentra la asignatura
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verifica que existe
    await this.asignaturaRepository.delete(id);
  }

  /**
   * Cuenta el total de asignaturas
   * @returns Cantidad total de asignaturas
   */
  async count(): Promise<number> {
    return await this.asignaturaRepository.count();
  }

  /**
   * Cuenta asignaturas por programa de estudio
   * @param programaEstudioId - UUID del programa de estudio
   * @returns Cantidad de asignaturas del programa
   */
  async countByProgramaEstudio(programaEstudioId: string): Promise<number> {
    return await this.asignaturaRepository.countByProgramaEstudio(
      programaEstudioId,
    );
  }
}
