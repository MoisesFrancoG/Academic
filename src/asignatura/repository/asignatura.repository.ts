import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Asignatura } from '../entities/asignatura.entity';
import { IAsignaturaRepository } from './asignatura.repository.interface';
import { CreateAsignaturaDto } from '../DTOs/create-asignatura.dto';
import { UpdateAsignaturaDto } from '../DTOs/update-asignatura.dto';

/**
 * Implementación concreta del repositorio de Asignatura usando TypeORM
 * Esta clase encapsula toda la lógica de acceso a datos
 */
@Injectable()
export class AsignaturaRepository implements IAsignaturaRepository {
  constructor(
    @Inject('ASIGNATURA_REPOSITORY')
    private readonly repository: Repository<Asignatura>,
  ) {}

  async create(createDto: CreateAsignaturaDto): Promise<Asignatura> {
    const nueva = this.repository.create(createDto);
    return await this.repository.save(nueva);
  }

  async findAll(): Promise<Asignatura[]> {
    return await this.repository.find({
      relations: ['programaEstudio'],
      order: { cuatrimestre: 'ASC', nombre: 'ASC' },
    });
  }

  async findById(id: string): Promise<Asignatura | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['programaEstudio'],
    });
  }

  async findByProgramaEstudio(programaEstudioId: string): Promise<Asignatura[]> {
    return await this.repository.find({
      where: { programaEstudioId },
      relations: ['programaEstudio'],
      order: { cuatrimestre: 'ASC', nombre: 'ASC' },
    });
  }

  async findByCuatrimestre(cuatrimestre: number): Promise<Asignatura[]> {
    return await this.repository.find({
      where: { cuatrimestre },
      relations: ['programaEstudio'],
      order: { nombre: 'ASC' },
    });
  }

  async findByCuatrimestreAndPrograma(
    cuatrimestre: number,
    programaEstudioId: string,
  ): Promise<Asignatura[]> {
    return await this.repository.find({
      where: { cuatrimestre, programaEstudioId },
      relations: ['programaEstudio'],
      order: { nombre: 'ASC' },
    });
  }

  async update(id: string, updateDto: UpdateAsignaturaDto): Promise<Asignatura> {
    await this.repository.update(id, updateDto);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Asignatura con ID ${id} no encontrada`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async countByProgramaEstudio(programaEstudioId: string): Promise<number> {
    return await this.repository.count({
      where: { programaEstudioId },
    });
  }
}
