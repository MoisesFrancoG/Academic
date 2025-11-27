import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IGrupoRepository } from '../repository/grupo.repository.interface';
import type { IAsignaturaRepository } from '../../asignatura/repository/asignatura.repository.interface';
import type { IDocenteRepository } from '../../docente/repository/docente.repository.interface';
import type { IAlumnoRepository } from '../../alumno/repository/alumno.repository.interface';
import { Grupo } from '../entities/grupo.entity';
import { CreateGrupoDto, UpdateGrupoDto, GrupoResponseDto } from '../DTOs';

/**
 * Servicio de negocio para la gestión de grupos
 */
@Injectable()
export class GrupoService {
  constructor(
    @Inject('IGrupoRepository')
    private readonly grupoRepository: IGrupoRepository,
    @Inject('IAsignaturaRepository')
    private readonly asignaturaRepository: IAsignaturaRepository,
    @Inject('IDocenteRepository')
    private readonly docenteRepository: IDocenteRepository,
    @Inject('IAlumnoRepository')
    private readonly alumnoRepository: IAlumnoRepository,
  ) {}

  /**
   * Crea un nuevo grupo
   * Valida que la asignatura y el docente existan
   * Valida que el docente tenga competencia en la asignatura
   * Si se proporcionan alumnos, valida que todos existan
   */
  async create(createGrupoDto: CreateGrupoDto): Promise<GrupoResponseDto> {
    const { nombre, asignaturaId, docenteId, alumnoIds } = createGrupoDto;

    // Validar que la asignatura existe
    const asignatura = await this.asignaturaRepository.findById(asignaturaId);
    if (!asignatura) {
      throw new NotFoundException(`Asignatura con ID ${asignaturaId} no encontrada`);
    }

    // Validar que el docente existe
    const docente = await this.docenteRepository.findById(docenteId);
    if (!docente) {
      throw new NotFoundException(`Docente con ID ${docenteId} no encontrado`);
    }

    // Validar que el docente tenga competencia en la asignatura
    const docenteConCompetencia = await this.docenteRepository.findByAsignaturaCompetencia(asignaturaId);
    const tieneCompetencia = docenteConCompetencia.some((d) => d.id === docenteId);
    if (!tieneCompetencia) {
      throw new BadRequestException(
        `El docente ${docente.nombre} no tiene competencia para impartir la asignatura ${asignatura.nombre}`,
      );
    }

    // Validar alumnos si se proporcionaron
    if (alumnoIds && alumnoIds.length > 0) {
      await this.validateAlumnos(alumnoIds);
    }

    // Crear grupo
    const grupo = new Grupo();
    grupo.nombre = nombre;
    grupo.asignatura = asignatura;
    grupo.docente = docente;

    // Los snapshots se llenan automáticamente en @BeforeInsert
    const createdGrupo = await this.grupoRepository.create(grupo);

    // Si hay alumnos, añadirlos al grupo
    if (alumnoIds && alumnoIds.length > 0) {
      await this.grupoRepository.updateAlumnos(createdGrupo.id, alumnoIds);
    }

    // Recargar con relaciones completas
    const fullGrupo = await this.grupoRepository.findById(createdGrupo.id);
    return this.toResponseDto(fullGrupo!);
  }

  /**
   * Busca un grupo por ID
   */
  async findById(id: string): Promise<GrupoResponseDto> {
    const grupo = await this.grupoRepository.findById(id);
    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }
    return this.toResponseDto(grupo);
  }

  /**
   * Obtiene todos los grupos
   */
  async findAll(): Promise<GrupoResponseDto[]> {
    const grupos = await this.grupoRepository.findAll();
    return grupos.map((grupo) => this.toResponseDto(grupo));
  }

  /**
   * Actualiza un grupo
   * Valida asignatura y docente si cambian
   * Valida competencia del docente con la asignatura
   */
  async update(id: string, updateGrupoDto: UpdateGrupoDto): Promise<GrupoResponseDto> {
    const grupo = await this.grupoRepository.findById(id);
    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    const { nombre, asignaturaId, docenteId, alumnoIds } = updateGrupoDto;

    // Actualizar nombre si se proporciona
    if (nombre !== undefined) {
      grupo.nombre = nombre;
    }

    // Si cambia la asignatura o el docente, validar competencia
    let newAsignaturaId = grupo.asignatura.id;
    let newDocenteId = grupo.docente.id;

    if (asignaturaId !== undefined) {
      const asignatura = await this.asignaturaRepository.findById(asignaturaId);
      if (!asignatura) {
        throw new NotFoundException(`Asignatura con ID ${asignaturaId} no encontrada`);
      }
      grupo.asignatura = asignatura;
      newAsignaturaId = asignaturaId;
    }

    if (docenteId !== undefined) {
      const docente = await this.docenteRepository.findById(docenteId);
      if (!docente) {
        throw new NotFoundException(`Docente con ID ${docenteId} no encontrado`);
      }
      grupo.docente = docente;
      newDocenteId = docenteId;
    }

    // Validar competencia del docente con la asignatura (nueva o existente)
    const docenteConCompetencia = await this.docenteRepository.findByAsignaturaCompetencia(newAsignaturaId);
    const tieneCompetencia = docenteConCompetencia.some((d) => d.id === newDocenteId);
    if (!tieneCompetencia) {
      throw new BadRequestException(
        `El docente no tiene competencia para impartir esta asignatura`,
      );
    }

    // Actualizar alumnos si se proporcionaron
    if (alumnoIds !== undefined) {
      if (alumnoIds.length > 0) {
        await this.validateAlumnos(alumnoIds);
        await this.grupoRepository.updateAlumnos(id, alumnoIds);
      } else {
        // Lista vacía: remover todos los alumnos
        await this.grupoRepository.updateAlumnos(id, []);
      }
    }

    // Los snapshots se actualizan en @BeforeUpdate
    const updatedGrupo = await this.grupoRepository.update(grupo);

    // Recargar con relaciones completas
    const fullGrupo = await this.grupoRepository.findById(updatedGrupo.id);
    return this.toResponseDto(fullGrupo!);
  }

  /**
   * Elimina un grupo
   */
  async delete(id: string): Promise<void> {
    const grupo = await this.grupoRepository.findById(id);
    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    const deleted = await this.grupoRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`No se pudo eliminar el grupo con ID ${id}`);
    }
  }

  /**
   * Cuenta el total de grupos
   */
  async count(): Promise<number> {
    return await this.grupoRepository.count();
  }

  /**
   * Busca grupos por asignatura
   */
  async findByAsignatura(asignaturaId: string): Promise<GrupoResponseDto[]> {
    const grupos = await this.grupoRepository.findByAsignatura(asignaturaId);
    return grupos.map((grupo) => this.toResponseDto(grupo));
  }

  /**
   * Busca grupos por docente
   */
  async findByDocente(docenteId: string): Promise<GrupoResponseDto[]> {
    const grupos = await this.grupoRepository.findByDocente(docenteId);
    return grupos.map((grupo) => this.toResponseDto(grupo));
  }

  /**
   * Busca grupos por alumno
   */
  async findByAlumno(alumnoId: string): Promise<GrupoResponseDto[]> {
    const grupos = await this.grupoRepository.findByAlumno(alumnoId);
    return grupos.map((grupo) => this.toResponseDto(grupo));
  }

  /**
   * Añade un alumno a un grupo
   */
  async addAlumno(grupoId: string, alumnoId: string): Promise<GrupoResponseDto> {
    // Validar que el grupo existe
    const grupo = await this.grupoRepository.findById(grupoId);
    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${grupoId} no encontrado`);
    }

    // Validar que el alumno existe
    const alumno = await this.alumnoRepository.findById(alumnoId);
    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${alumnoId} no encontrado`);
    }

    const updatedGrupo = await this.grupoRepository.addAlumno(grupoId, alumnoId);
    return this.toResponseDto(updatedGrupo);
  }

  /**
   * Elimina un alumno de un grupo
   */
  async removeAlumno(grupoId: string, alumnoId: string): Promise<GrupoResponseDto> {
    // Validar que el grupo existe
    const grupo = await this.grupoRepository.findById(grupoId);
    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${grupoId} no encontrado`);
    }

    const updatedGrupo = await this.grupoRepository.removeAlumno(grupoId, alumnoId);
    return this.toResponseDto(updatedGrupo);
  }

  /**
   * Actualiza la lista completa de alumnos de un grupo
   */
  async updateAlumnos(grupoId: string, alumnoIds: string[]): Promise<GrupoResponseDto> {
    // Validar que el grupo existe
    const grupo = await this.grupoRepository.findById(grupoId);
    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${grupoId} no encontrado`);
    }

    // Validar que todos los alumnos existen
    if (alumnoIds.length > 0) {
      await this.validateAlumnos(alumnoIds);
    }

    const updatedGrupo = await this.grupoRepository.updateAlumnos(grupoId, alumnoIds);
    return this.toResponseDto(updatedGrupo);
  }

  /**
   * Cuenta el número de alumnos en un grupo
   */
  async countAlumnos(grupoId: string): Promise<number> {
    // Validar que el grupo existe
    const grupo = await this.grupoRepository.findById(grupoId);
    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${grupoId} no encontrado`);
    }

    return await this.grupoRepository.countAlumnos(grupoId);
  }

  /**
   * Valida que todos los alumnos existen
   */
  private async validateAlumnos(alumnoIds: string[]): Promise<void> {
    for (const alumnoId of alumnoIds) {
      const alumno = await this.alumnoRepository.findById(alumnoId);
      if (!alumno) {
        throw new NotFoundException(`Alumno con ID ${alumnoId} no encontrado`);
      }
    }
  }

  /**
   * Convierte una entidad Grupo a DTO de respuesta
   */
  private toResponseDto(grupo: Grupo): GrupoResponseDto {
    return {
      id: grupo.id,
      nombre: grupo.nombre,
      asignaturaNombreSnapshot: grupo.asignaturaNombreSnapshot,
      docenteNombreSnapshot: grupo.docenteNombreSnapshot,
      asignaturaId: grupo.asignatura.id,
      docenteId: grupo.docente.id,
      createdAt: grupo.createdAt,
      updatedAt: grupo.updatedAt,
    };
  }
}
