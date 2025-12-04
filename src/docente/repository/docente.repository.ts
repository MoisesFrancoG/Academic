import { Injectable, Inject } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { Docente } from '../entities/docente.entity';
import { Asignatura } from '../../asignatura/entities/asignatura.entity';
import { IDocenteRepository } from './docente.repository.interface';
import { CreateDocenteDto } from '../DTOs/create-docente.dto';
import { UpdateDocenteDto } from '../DTOs/update-docente.dto';

/**
 * Implementación concreta del repositorio de Docente usando TypeORM
 * Esta clase encapsula toda la lógica de acceso a datos
 */
@Injectable()
export class DocenteRepository implements IDocenteRepository {
  constructor(
    @Inject('DOCENTE_REPOSITORY')
    private readonly repository: Repository<Docente>,
    @Inject('ASIGNATURA_REPOSITORY')
    private readonly asignaturaRepository: Repository<Asignatura>,
  ) {}

  async create(createDto: CreateDocenteDto): Promise<Docente> {
    const docente = this.repository.create({
      nombre: createDto.nombre,
    });

    // Si se proporcionan competencias, cargarlas
    if (
      createDto.asignaturasCompetenciaIds &&
      createDto.asignaturasCompetenciaIds.length > 0
    ) {
      const asignaturas = await this.asignaturaRepository.find({
        where: { id: In(createDto.asignaturasCompetenciaIds) },
      });
      docente.asignaturasCompetencia = asignaturas;
    }

    return await this.repository.save(docente);
  }

  async findAll(): Promise<Docente[]> {
    return await this.repository.find({
      relations: ['asignaturasCompetencia'],
      order: { nombre: 'ASC' },
    });
  }

  async findById(id: string): Promise<Docente | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findByIdWithRelations(id: string): Promise<Docente | null> {
    return await this.repository.findOne({
      where: { id },
      relations: [
        'asignaturasCompetencia',
        'asignaturasCompetencia.programaEstudio',
      ],
    });
  }

  async findByAsignaturaCompetencia(asignaturaId: string): Promise<Docente[]> {
    return await this.repository
      .createQueryBuilder('docente')
      .innerJoin('docente.asignaturasCompetencia', 'asignatura')
      .where('asignatura.id = :asignaturaId', { asignaturaId })
      .orderBy('docente.nombre', 'ASC')
      .getMany();
  }

  async update(
    id: string,
    updateDto: UpdateDocenteDto | Partial<Docente>,
  ): Promise<Docente> {
    // Si recibimos una entidad parcial con deletedAt, hacer un save directo
    if ('deletedAt' in updateDto) {
      const entity = await this.repository.preload({
        id,
        ...updateDto,
      });
      if (!entity) {
        throw new Error(`Docente con ID ${id} no encontrado`);
      }
      return await this.repository.save(entity);
    }

    const docente = await this.findById(id);
    if (!docente) {
      throw new Error(`Docente con ID ${id} no encontrado`);
    }

    // Actualizar campos básicos
    if ('nombre' in updateDto && updateDto.nombre) {
      docente.nombre = updateDto.nombre;
    }

    // Actualizar competencias si se proporcionan (solo si es UpdateDocenteDto)
    if (
      'asignaturasCompetenciaIds' in updateDto &&
      updateDto.asignaturasCompetenciaIds !== undefined
    ) {
      if (updateDto.asignaturasCompetenciaIds.length > 0) {
        const asignaturas = await this.asignaturaRepository.find({
          where: { id: In(updateDto.asignaturasCompetenciaIds) },
        });
        docente.asignaturasCompetencia = asignaturas;
      } else {
        docente.asignaturasCompetencia = [];
      }
    }

    // Regla A: Marcar como no sincronizado al actualizar
    docente.sincronizado = false;
    return await this.repository.save(docente);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async addCompetencia(docenteId: string, asignaturaId: string): Promise<void> {
    const docente = await this.repository.findOne({
      where: { id: docenteId },
      relations: ['asignaturasCompetencia'],
    });

    if (!docente) {
      throw new Error(`Docente con ID ${docenteId} no encontrado`);
    }

    const asignatura = await this.asignaturaRepository.findOne({
      where: { id: asignaturaId },
    });

    if (!asignatura) {
      throw new Error(`Asignatura con ID ${asignaturaId} no encontrada`);
    }

    // Verificar si ya tiene esta competencia
    const yaExiste = docente.asignaturasCompetencia.some(
      (a) => a.id === asignaturaId,
    );
    if (!yaExiste) {
      docente.asignaturasCompetencia.push(asignatura);
      await this.repository.save(docente);
    }
  }

  async removeCompetencia(
    docenteId: string,
    asignaturaId: string,
  ): Promise<void> {
    const docente = await this.repository.findOne({
      where: { id: docenteId },
      relations: ['asignaturasCompetencia'],
    });

    if (!docente) {
      throw new Error(`Docente con ID ${docenteId} no encontrado`);
    }

    docente.asignaturasCompetencia = docente.asignaturasCompetencia.filter(
      (a) => a.id !== asignaturaId,
    );

    await this.repository.save(docente);
  }

  async updateCompetencias(
    docenteId: string,
    asignaturaIds: string[],
  ): Promise<void> {
    const docente = await this.repository.findOne({
      where: { id: docenteId },
      relations: ['asignaturasCompetencia'],
    });

    if (!docente) {
      throw new Error(`Docente con ID ${docenteId} no encontrado`);
    }

    if (asignaturaIds.length > 0) {
      const asignaturas = await this.asignaturaRepository.find({
        where: { id: In(asignaturaIds) },
      });
      docente.asignaturasCompetencia = asignaturas;
    } else {
      docente.asignaturasCompetencia = [];
    }

    await this.repository.save(docente);
  }

  async findUnsynchronized(): Promise<Docente[]> {
    return await this.repository.find({
      where: {
        sincronizado: false,
        deletedAt: null as any,
      },
      relations: ['asignaturasCompetencia'],
      order: { createdAt: 'ASC' },
    });
  }

  async findDeletedUnsynchronized(): Promise<Docente[]> {
    return await this.repository
      .find({
        where: {
          sincronizado: false,
        },
        relations: ['asignaturasCompetencia'],
        withDeleted: true,
        order: { deletedAt: 'ASC' },
      })
      .then((all) => all.filter((d) => d.deletedAt !== null));
  }
}
