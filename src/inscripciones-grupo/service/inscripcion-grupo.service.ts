import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InscripcionGrupo } from '../entities/inscripcion-grupo.entity';
import {
  CreateInscripcionGrupoDto,
  InscripcionGrupoResponseDto,
} from '../DTOs';
import type { IInscripcionGrupoRepository } from '../repository/inscripcion-grupo.repository.interface';
import type { IGrupoRepository } from '../../grupo/repository/grupo.repository.interface';
import type { IAlumnoRepository } from '../../alumno/repository/alumno.repository.interface';

/**
 * Servicio de lógica de negocio para Inscripciones de Grupo
 * Maneja la matriculación de alumnos a grupos con soporte para sincronización Moodle
 */
@Injectable()
export class InscripcionGrupoService {
  constructor(
    @Inject('IInscripcionGrupoRepository')
    private readonly inscripcionRepository: IInscripcionGrupoRepository,
    @Inject('IGrupoRepository')
    private readonly grupoRepository: IGrupoRepository,
    @Inject('IAlumnoRepository')
    private readonly alumnoRepository: IAlumnoRepository,
  ) {}

  /**
   * Inscribe un alumno a un grupo
   * Valida que el grupo y alumno existan
   * Verifica que no exista una inscripción previa activa
   */
  async create(
    dto: CreateInscripcionGrupoDto,
  ): Promise<InscripcionGrupoResponseDto> {
    // Validar que el grupo existe
    const grupo = await this.grupoRepository.findById(dto.grupoId);
    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${dto.grupoId} no encontrado`);
    }

    // Validar que el alumno existe
    const alumno = await this.alumnoRepository.findById(dto.alumnoId);
    if (!alumno) {
      throw new NotFoundException(
        `Alumno con ID ${dto.alumnoId} no encontrado`,
      );
    }

    // Verificar que no existe una inscripción activa
    const existente = await this.inscripcionRepository.exists(
      dto.grupoId,
      dto.alumnoId,
    );
    if (existente) {
      throw new ConflictException(
        `El alumno ${alumno.nombre} ya está inscrito en el grupo ${grupo.nombre}`,
      );
    }

    const inscripcion = await this.inscripcionRepository.create(dto);
    return this.toResponseDto(inscripcion);
  }

  /**
   * Busca todas las inscripciones activas
   */
  async findAll(): Promise<InscripcionGrupoResponseDto[]> {
    const inscripciones = await this.inscripcionRepository.findAll();
    return inscripciones.map((i) => this.toResponseDto(i));
  }

  /**
   * Busca una inscripción por ID
   */
  async findOne(id: string): Promise<InscripcionGrupoResponseDto> {
    const inscripcion = await this.inscripcionRepository.findById(id);
    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }
    return this.toResponseDto(inscripcion);
  }

  /**
   * Busca inscripciones por grupo
   */
  async findByGrupo(grupoId: string): Promise<InscripcionGrupoResponseDto[]> {
    const inscripciones = await this.inscripcionRepository.findByGrupo(grupoId);
    return inscripciones.map((i) => this.toResponseDto(i));
  }

  /**
   * Busca inscripciones por alumno
   */
  async findByAlumno(alumnoId: string): Promise<InscripcionGrupoResponseDto[]> {
    const inscripciones =
      await this.inscripcionRepository.findByAlumno(alumnoId);
    return inscripciones.map((i) => this.toResponseDto(i));
  }

  /**
   * Elimina una inscripción (Soft Delete)
   * Marca sincronizado = false para que el Orquestador desmatricule en Moodle
   */
  async remove(id: string): Promise<void> {
    const inscripcion = await this.inscripcionRepository.findById(id);
    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    // Soft Delete con bandera abajo
    await this.inscripcionRepository.softDelete(id);
  }

  /**
   * Cuenta inscripciones activas en un grupo
   */
  async countByGrupo(grupoId: string): Promise<number> {
    return await this.inscripcionRepository.countByGrupo(grupoId);
  }

  /**
   * Obtiene inscripciones no sincronizadas (para el Orquestador)
   * OPTIMIZACIÓN: Incluye grupo.moodleCourseId y alumno.moodleUserId
   */
  async findUnsynchronized(): Promise<any[]> {
    const inscripciones = await this.inscripcionRepository.findUnsynchronized();
    return inscripciones.map((i) => ({
      id: i.id,
      grupoId: i.grupoId,
      alumnoId: i.alumnoId,
      sincronizado: i.sincronizado,
      createdAt: i.createdAt,
      deletedAt: i.deletedAt,
      grupo: i.grupo
        ? {
            id: i.grupo.id,
            nombre: i.grupo.nombre,
            moodleCourseId: i.grupo.moodleCourseId,
          }
        : undefined,
      alumno: i.alumno
        ? {
            id: i.alumno.id,
            nombre: i.alumno.nombre,
            matricula: i.alumno.matricula,
            moodleUserId: i.alumno.moodleUserId,
          }
        : undefined,
    }));
  }

  /**
   * Obtiene inscripciones eliminadas no sincronizadas
   * OPTIMIZACIÓN: Incluye grupo.moodleCourseId y alumno.moodleUserId
   */
  async findDeletedUnsynchronized(): Promise<any[]> {
    const inscripciones =
      await this.inscripcionRepository.findDeletedUnsynchronized();
    return inscripciones.map((i) => ({
      id: i.id,
      grupoId: i.grupoId,
      alumnoId: i.alumnoId,
      sincronizado: i.sincronizado,
      createdAt: i.createdAt,
      deletedAt: i.deletedAt,
      grupo: i.grupo
        ? {
            id: i.grupo.id,
            nombre: i.grupo.nombre,
            moodleCourseId: i.grupo.moodleCourseId,
          }
        : undefined,
      alumno: i.alumno
        ? {
            id: i.alumno.id,
            nombre: i.alumno.nombre,
            matricula: i.alumno.matricula,
            moodleUserId: i.alumno.moodleUserId,
          }
        : undefined,
    }));
  }

  /**
   * Marca una inscripción como sincronizada
   */
  async markAsSynchronized(id: string): Promise<void> {
    await this.inscripcionRepository.markAsSynchronized(id);
  }

  /**
   * Convierte una entidad a DTO de respuesta
   */
  private toResponseDto(
    inscripcion: InscripcionGrupo,
  ): InscripcionGrupoResponseDto {
    return {
      id: inscripcion.id,
      grupoId: inscripcion.grupoId,
      alumnoId: inscripcion.alumnoId,
      sincronizado: inscripcion.sincronizado,
      createdAt: inscripcion.createdAt,
      deletedAt: inscripcion.deletedAt,
      grupoNombre: inscripcion.grupo?.nombre,
      alumnoNombre: inscripcion.alumno?.nombre,
      alumnoMatricula: inscripcion.alumno?.matricula,
    };
  }
}
