import { Injectable, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull } from 'typeorm';
import type { IGrupoRepository } from './grupo.repository.interface';
import { Grupo } from '../entities/grupo.entity';
import { InscripcionGrupo } from '../../inscripciones-grupo/entities/inscripcion-grupo.entity';

/**
 * Implementación del repositorio de Grupo usando TypeORM
 * Ahora usa InscripcionGrupo para manejar la relación con alumnos
 */
@Injectable()
export class GrupoRepository implements IGrupoRepository {
  constructor(
    @Inject('GRUPO_REPOSITORY')
    private readonly grupoRepository: Repository<Grupo>,
    @Inject('INSCRIPCION_GRUPO_REPOSITORY')
    private readonly inscripcionRepository: Repository<InscripcionGrupo>,
  ) {}

  async create(grupo: Grupo): Promise<Grupo> {
    return await this.grupoRepository.save(grupo);
  }

  async findById(id: string): Promise<Grupo | null> {
    return await this.grupoRepository.findOne({
      where: { id },
      relations: [
        'asignatura',
        'asignatura.programaEstudio',
        'docente',
        'inscripciones',
        'inscripciones.alumno',
      ],
    });
  }

  async findAll(): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      relations: [
        'asignatura',
        'asignatura.programaEstudio',
        'docente',
        'inscripciones',
        'inscripciones.alumno',
      ],
    });
  }

  async update(grupo: Grupo): Promise<Grupo> {
    return await this.grupoRepository.save(grupo);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.grupoRepository.delete(id);
    return (
      result.affected !== null &&
      result.affected !== undefined &&
      result.affected > 0
    );
  }

  async count(): Promise<number> {
    return await this.grupoRepository.count();
  }

  async findByAsignatura(asignaturaId: string): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      where: { asignatura: { id: asignaturaId } },
      relations: [
        'asignatura',
        'asignatura.programaEstudio',
        'docente',
        'inscripciones',
        'inscripciones.alumno',
      ],
    });
  }

  async findByDocente(docenteId: string): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      where: { docente: { id: docenteId } },
      relations: [
        'asignatura',
        'asignatura.programaEstudio',
        'docente',
        'inscripciones',
        'inscripciones.alumno',
      ],
    });
  }

  async findByAlumno(alumnoId: string): Promise<Grupo[]> {
    return await this.grupoRepository
      .createQueryBuilder('grupo')
      .leftJoinAndSelect('grupo.asignatura', 'asignatura')
      .leftJoinAndSelect('asignatura.programaEstudio', 'programaEstudio')
      .leftJoinAndSelect('grupo.docente', 'docente')
      .leftJoinAndSelect('grupo.inscripciones', 'inscripciones')
      .leftJoinAndSelect('inscripciones.alumno', 'alumno')
      .where('alumno.id = :alumnoId', { alumnoId })
      .getMany();
  }

  async addAlumno(grupoId: string, alumnoId: string): Promise<Grupo> {
    // Verificar si ya existe una inscripción
    const existente = await this.inscripcionRepository.findOne({
      where: { grupoId, alumnoId },
    });

    if (!existente) {
      // Crear nueva inscripción
      const inscripcion = this.inscripcionRepository.create({
        grupoId,
        alumnoId,
        sincronizado: false,
      });
      await this.inscripcionRepository.save(inscripcion);
    }

    return (await this.findById(grupoId)) as Grupo;
  }

  async removeAlumno(grupoId: string, alumnoId: string): Promise<Grupo> {
    // Buscar la inscripción
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { grupoId, alumnoId },
    });

    if (inscripcion) {
      // Soft Delete: marcar deletedAt y bajar bandera
      inscripcion.deletedAt = new Date();
      inscripcion.sincronizado = false;
      await this.inscripcionRepository.save(inscripcion);
    }

    return (await this.findById(grupoId)) as Grupo;
  }

  async updateAlumnos(grupoId: string, alumnoIds: string[]): Promise<Grupo> {
    // Obtener inscripciones actuales del grupo
    const inscripcionesActuales = await this.inscripcionRepository.find({
      where: { grupoId },
    });

    const alumnosActualesIds = inscripcionesActuales.map((i) => i.alumnoId);

    // Alumnos a agregar (están en alumnoIds pero no en actuales)
    const alumnosAgregar = alumnoIds.filter(
      (id) => !alumnosActualesIds.includes(id),
    );

    // Alumnos a remover (están en actuales pero no en alumnoIds)
    const alumnosRemover = alumnosActualesIds.filter(
      (id) => !alumnoIds.includes(id),
    );

    // Agregar nuevas inscripciones
    for (const alumnoId of alumnosAgregar) {
      const inscripcion = this.inscripcionRepository.create({
        grupoId,
        alumnoId,
        sincronizado: false,
      });
      await this.inscripcionRepository.save(inscripcion);
    }

    // Soft delete de inscripciones removidas
    for (const alumnoId of alumnosRemover) {
      const inscripcion = inscripcionesActuales.find(
        (i) => i.alumnoId === alumnoId,
      );
      if (inscripcion) {
        inscripcion.deletedAt = new Date();
        inscripcion.sincronizado = false;
        await this.inscripcionRepository.save(inscripcion);
      }
    }

    return (await this.findById(grupoId)) as Grupo;
  }

  async countAlumnos(grupoId: string): Promise<number> {
    return await this.inscripcionRepository.count({
      where: { grupoId },
    });
  }

  async findUnsynchronized(): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      where: {
        sincronizado: false,
        deletedAt: null as any,
      },
      relations: [
        'asignatura',
        'asignatura.programaEstudio',
        'docente',
        'inscripciones',
        'inscripciones.alumno',
      ],
      order: { createdAt: 'ASC' },
    });
  }

  async findDeletedUnsynchronized(): Promise<Grupo[]> {
    return await this.grupoRepository.find({
      where: {
        sincronizado: false,
        deletedAt: Not(IsNull()), // CRÍTICO: Filtrar solo eliminados, evita falso positivo
      },
      relations: [
        'asignatura',
        'asignatura.programaEstudio',
        'docente',
        'inscripciones',
        'inscripciones.alumno',
      ],
      withDeleted: true,
      order: { deletedAt: 'ASC' },
    });
  }
}
