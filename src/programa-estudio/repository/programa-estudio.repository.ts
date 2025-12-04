import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProgramaEstudio } from '../entities/programa-estudio.entity';
import { IProgramaEstudioRepository } from './programa-estudio.repository.interface';
import { CreateProgramaEstudioDto } from '../DTOs/create-programa-estudio.dto';
import { UpdateProgramaEstudioDto } from '../DTOs/update-programa-estudio.dto';

/**
 * Implementación concreta del repositorio de Programa de Estudio usando TypeORM
 * Esta clase encapsula toda la lógica de acceso a datos
 */
@Injectable()
export class ProgramaEstudioRepository implements IProgramaEstudioRepository {
  constructor(
    @Inject('PROGRAMA_ESTUDIO_REPOSITORY')
    private readonly repository: Repository<ProgramaEstudio>,
  ) {}

  async create(createDto: CreateProgramaEstudioDto): Promise<ProgramaEstudio> {
    const nuevo = this.repository.create(createDto);
    return await this.repository.save(nuevo);
  }

  async findAll(): Promise<ProgramaEstudio[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<ProgramaEstudio | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findByNombre(nombre: string): Promise<ProgramaEstudio | null> {
    return await this.repository.findOne({
      where: { nombre },
    });
  }

  async update(
    id: string,
    updateDto: UpdateProgramaEstudioDto | Partial<ProgramaEstudio>,
  ): Promise<ProgramaEstudio> {
    // Si recibimos una entidad parcial con deletedAt, hacer un save directo
    if ('deletedAt' in updateDto) {
      const entity = await this.repository.preload({
        id,
        ...updateDto,
      });
      if (!entity) {
        throw new Error(`Programa de estudio con ID ${id} no encontrado`);
      }
      return await this.repository.save(entity);
    }

    // Para actualizaciones normales, cargar entidad y actualizar
    const programa = await this.findById(id);
    if (!programa) {
      throw new Error(`Programa de estudio con ID ${id} no encontrado`);
    }

    // Aplicar cambios
    Object.assign(programa, updateDto);

    // Regla A: Marcar como no sincronizado
    programa.sincronizado = false;

    return await this.repository.save(programa);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async existsByNombre(nombre: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { nombre },
    });
    return count > 0;
  }

  async findByCantidadCuatrimestres(
    cantidad: number,
  ): Promise<ProgramaEstudio[]> {
    return await this.repository.find({
      where: { cantidadCuatrimestres: cantidad },
      order: { nombre: 'ASC' },
    });
  }
}
