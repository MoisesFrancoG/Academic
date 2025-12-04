import { Injectable, Inject } from '@nestjs/common';
import { Repository, Not, IsNull } from 'typeorm';
import { Alumno } from '../entities/alumno.entity';
import { IAlumnoRepository } from './alumno.repository.interface';
import { CreateAlumnoDto } from '../DTOs/create-alumno.dto';
import { UpdateAlumnoDto } from '../DTOs/update-alumno.dto';
import { InscripcionGrupo } from '../../inscripciones-grupo/entities/inscripcion-grupo.entity';

/**
 * Implementación concreta del repositorio de Alumno usando TypeORM
 * Esta clase encapsula toda la lógica de acceso a datos
 */
@Injectable()
export class AlumnoRepository implements IAlumnoRepository {
  constructor(
    @Inject('ALUMNO_REPOSITORY')
    private readonly repository: Repository<Alumno>,
    @Inject('INSCRIPCION_GRUPO_REPOSITORY')
    private readonly inscripcionRepository: Repository<InscripcionGrupo>,
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

  async softDelete(id: string): Promise<boolean> {
    // 1. Soft Delete del Alumno
    const result = await this.repository.softDelete(id);
    
    if (result.affected && result.affected > 0) {
      // 2. INTEGRIDAD: Soft Delete en cascada de las inscripciones de este alumno
      await this.inscripcionRepository.softDelete({ alumnoId: id });
      
      // 3. Marcar inscripciones como no sincronizadas
      // Para que el Orquestador detecte que debe desmatricular en Moodle
      await this.inscripcionRepository.update(
        { alumnoId: id },
        { sincronizado: false },
      );
      
      // 4. Marcar Alumno como no sincronizado
      // Para que el Orquestador detecte que debe eliminar el usuario de Moodle
      await this.repository.update(id, { sincronizado: false });
      
      return true;
    }
    
    return false;
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

  async findUnsynchronized(): Promise<Alumno[]> {
    return await this.repository.find({
      where: {
        sincronizado: false,
        deletedAt: null as any,
      },
      order: { createdAt: 'ASC' },
    });
  }

  async findDeletedUnsynchronized(): Promise<Alumno[]> {
    return await this.repository.find({
      where: {
        sincronizado: false,
        deletedAt: Not(IsNull()), // CRÍTICO: Filtrar solo eliminados, evita falso positivo
      },
      withDeleted: true,
      order: { deletedAt: 'ASC' },
    });
  }
}
