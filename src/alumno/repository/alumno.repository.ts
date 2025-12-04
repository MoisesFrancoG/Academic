import { Injectable, Inject } from '@nestjs/common';
import { Repository, Not } from 'typeorm';
import { Alumno } from '../entities/alumno.entity';
import { IAlumnoRepository } from './alumno.repository.interface';
import { CreateAlumnoDto } from '../DTOs/create-alumno.dto';
import { UpdateAlumnoDto } from '../DTOs/update-alumno.dto';

/**
 * Implementación concreta del repositorio de Alumno usando TypeORM
 * Esta clase encapsula toda la lógica de acceso a datos
 */
@Injectable()
export class AlumnoRepository implements IAlumnoRepository {
  constructor(
    @Inject('ALUMNO_REPOSITORY')
    private readonly repository: Repository<Alumno>,
  ) {}

  async create(createDto: CreateAlumnoDto): Promise<Alumno> {
    const nuevo = this.repository.create(createDto);
    return await this.repository.save(nuevo);
  }

  async findAll(): Promise<Alumno[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Alumno | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async findByMatricula(matricula: string): Promise<Alumno | null> {
    return await this.repository.findOne({
      where: { matricula },
    });
  }

  async findByCuatrimestre(cuatrimestre: number): Promise<Alumno[]> {
    return await this.repository.find({
      where: { cuatrimestreActual: cuatrimestre },
      order: { nombre: 'ASC' },
    });
  }

  async update(
    id: string,
    updateDto: UpdateAlumnoDto | Partial<Alumno>,
  ): Promise<Alumno> {
    // Si recibimos una entidad parcial con deletedAt, hacer un save directo
    if ('deletedAt' in updateDto) {
      const entity = await this.repository.preload({
        id,
        ...updateDto,
      });
      if (!entity) {
        throw new Error(`Alumno con ID ${id} no encontrado`);
      }
      return await this.repository.save(entity);
    }

    // Para actualizaciones normales, marcar como no sincronizado
    await this.repository.update(id, {
      ...updateDto,
      sincronizado: false,
    });
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Alumno con ID ${id} no encontrado`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async existsByMatricula(matricula: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { matricula },
    });
    return count > 0;
  }

  async existsByMatriculaExcludingId(
    matricula: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        matricula,
        id: Not(excludeId),
      },
    });
    return count > 0;
  }
}
