import { Injectable, Inject } from '@nestjs/common';
import { Repository, IsNull, Not } from 'typeorm';
import { InscripcionGrupo } from '../entities/inscripcion-grupo.entity';
import { IInscripcionGrupoRepository } from './inscripcion-grupo.repository.interface';
import { CreateInscripcionGrupoDto } from '../DTOs';

/**
 * Implementación del repositorio de Inscripciones de Grupo
 * Usa TypeORM Repository internamente
 */
@Injectable()
export class InscripcionGrupoRepository implements IInscripcionGrupoRepository {
  constructor(
    @Inject('INSCRIPCION_GRUPO_REPOSITORY')
    private readonly repository: Repository<InscripcionGrupo>,
  ) {}

  async create(dto: CreateInscripcionGrupoDto): Promise<InscripcionGrupo> {
    const inscripcion = this.repository.create({
      grupoId: dto.grupoId,
      alumnoId: dto.alumnoId,
      sincronizado: false, // Siempre false al crear
    });
    return await this.repository.save(inscripcion);
  }

  async findById(id: string): Promise<InscripcionGrupo | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['grupo', 'alumno'],
    });
  }

  async findAll(): Promise<InscripcionGrupo[]> {
    return await this.repository.find({
      relations: ['grupo', 'alumno'],
    });
  }

  async findByGrupo(grupoId: string): Promise<InscripcionGrupo[]> {
    return await this.repository.find({
      where: { grupoId },
      relations: ['alumno'],
    });
  }

  async findByAlumno(alumnoId: string): Promise<InscripcionGrupo[]> {
    return await this.repository.find({
      where: { alumnoId },
      relations: ['grupo'],
    });
  }

  async findByGrupoAndAlumno(
    grupoId: string,
    alumnoId: string,
  ): Promise<InscripcionGrupo | null> {
    return await this.repository.findOne({
      where: { grupoId, alumnoId },
      relations: ['grupo', 'alumno'],
    });
  }

  async exists(grupoId: string, alumnoId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { grupoId, alumnoId },
    });
    return count > 0;
  }

  async softDelete(id: string): Promise<InscripcionGrupo | null> {
    // Soft Delete Manual: marcar deletedAt Y bajar bandera sincronizado
    const inscripcion = await this.repository.preload({
      id: id,
      deletedAt: new Date(),
      sincronizado: false, // Avisar al Orquestador
    });

    if (!inscripcion) return null;
    return await this.repository.save(inscripcion);
  }

  async countByGrupo(grupoId: string): Promise<number> {
    return await this.repository.count({
      where: { grupoId },
    });
  }

  async findUnsynchronized(): Promise<InscripcionGrupo[]> {
    return await this.repository.find({
      where: {
        sincronizado: false,
        deletedAt: IsNull(), // Solo activas no sincronizadas
      },
      relations: ['grupo', 'alumno'],
    });
  }

  async findDeletedUnsynchronized(): Promise<InscripcionGrupo[]> {
    return await this.repository.find({
      where: {
        sincronizado: false,
        deletedAt: Not(IsNull()), // Solo eliminadas no sincronizadas
      },
      relations: ['grupo', 'alumno'],
      withDeleted: true, // Importante: incluir soft deleted
    });
  }

  /**
   * Marca una inscripción como sincronizada después de confirmar en Moodle
   * IMPORTANTE: Usa save() directo para garantizar que sincronizado = true prevalezca
   * CRÍTICO: Incluye withDeleted para poder confirmar bajas (soft deletes)
   * @param id - ID de la inscripción
   */
  async markAsSynchronized(id: string): Promise<void> {
    // CRÍTICO: Agregar 'withDeleted: true' para poder actualizar registros borrados
    const inscripcion = await this.repository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!inscripcion) {
      throw new Error(`Inscripción con ID ${id} no encontrada`);
    }
    
    inscripcion.sincronizado = true;
    await this.repository.save(inscripcion);
  }
}
