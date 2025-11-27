import { Injectable, Inject } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import type { IGrupoRepository } from './grupo.repository.interface';
import { Grupo } from '../entities/grupo.entity';
import { Alumno } from '../../alumno/entities/alumno.entity';

/**
 * Implementación del repositorio de Grupo usando TypeORM
 */
@Injectable()
export class GrupoRepository implements IGrupoRepository {
  constructor(
    @Inject('GRUPO_REPOSITORY')
    private readonly grupoRepository: Repository<Grupo>,
    @Inject('ALUMNO_REPOSITORY')
    private readonly alumnoRepository: Repository<Alumno>,
  ) {}

  async create(grupo: Grupo): Promise<Grupo> {
    return await this.grupoRepository.save(grupo);
  }

  async findById(id: string): Promise<Grupo | null> {
    return await this.grupoRepository.findOne({
      where: { id },
      relations: ['asignatura', 'asignatura.programaEstudio', 'docente', 'alumnos'],
    });
  }

  async findAll(): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      relations: ['asignatura', 'asignatura.programaEstudio', 'docente', 'alumnos'],
    });
  }

  async update(grupo: Grupo): Promise<Grupo> {
    return await this.grupoRepository.save(grupo);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.grupoRepository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

  async count(): Promise<number> {
    return await this.grupoRepository.count();
  }

  async findByAsignatura(asignaturaId: string): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      where: { asignatura: { id: asignaturaId } },
      relations: ['asignatura', 'asignatura.programaEstudio', 'docente', 'alumnos'],
    });
  }

  async findByDocente(docenteId: string): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      where: { docente: { id: docenteId } },
      relations: ['asignatura', 'asignatura.programaEstudio', 'docente', 'alumnos'],
    });
  }

  async findByAlumno(alumnoId: string): Promise<Grupo[]> {
    return await this.grupoRepository
      .createQueryBuilder('grupo')
      .leftJoinAndSelect('grupo.asignatura', 'asignatura')
      .leftJoinAndSelect('asignatura.programaEstudio', 'programaEstudio')
      .leftJoinAndSelect('grupo.docente', 'docente')
      .leftJoinAndSelect('grupo.alumnos', 'alumnos')
      .where('alumnos.id = :alumnoId', { alumnoId })
      .getMany();
  }

  async addAlumno(grupoId: string, alumnoId: string): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({
      where: { id: grupoId },
      relations: ['asignatura', 'docente', 'alumnos'],
    });

    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }

    const alumno = await this.alumnoRepository.findOne({
      where: { id: alumnoId },
    });

    if (!alumno) {
      throw new Error('Alumno no encontrado');
    }

    // Verificar si el alumno ya está inscrito
    const alreadyEnrolled = grupo.alumnos?.some((a) => a.id === alumnoId);
    if (!alreadyEnrolled) {
      grupo.alumnos = [...(grupo.alumnos || []), alumno];
      await this.grupoRepository.save(grupo);
    }

    return await this.findById(grupoId) as Grupo;
  }

  async removeAlumno(grupoId: string, alumnoId: string): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({
      where: { id: grupoId },
      relations: ['asignatura', 'docente', 'alumnos'],
    });

    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }

    grupo.alumnos = grupo.alumnos?.filter((a) => a.id !== alumnoId) || [];
    await this.grupoRepository.save(grupo);

    return await this.findById(grupoId) as Grupo;
  }

  async updateAlumnos(grupoId: string, alumnoIds: string[]): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({
      where: { id: grupoId },
      relations: ['asignatura', 'docente', 'alumnos'],
    });

    if (!grupo) {
      throw new Error('Grupo no encontrado');
    }

    // Buscar todos los alumnos por sus IDs
    const alumnos = await this.alumnoRepository.find({
      where: { id: In(alumnoIds) },
    });

    // Verificar que todos los alumnos existen
    if (alumnos.length !== alumnoIds.length) {
      throw new Error('Uno o más alumnos no fueron encontrados');
    }

    grupo.alumnos = alumnos;
    await this.grupoRepository.save(grupo);

    return await this.findById(grupoId) as Grupo;
  }

  async countAlumnos(grupoId: string): Promise<number> {
    const grupo = await this.grupoRepository.findOne({
      where: { id: grupoId },
      relations: ['alumnos'],
    });

    return grupo?.alumnos?.length || 0;
  }
}
