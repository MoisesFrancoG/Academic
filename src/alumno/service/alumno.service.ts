import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Alumno } from '../entities/alumno.entity';
import { CreateAlumnoDto, UpdateAlumnoDto } from '../DTOs';
import type { IAlumnoRepository } from '../repository/alumno.repository.interface';
import { Repository } from 'typeorm';
import { InscripcionGrupo } from '../../inscripciones-grupo/entities/inscripcion-grupo.entity';

/**
 * Servicio de lógica de negocio para Alumno
 * Depende SOLO de la interfaz IAlumnoRepository
 * No conoce la implementación concreta (AlumnoRepository)
 * Esto permite total desacoplamiento y facilita testing
 */
@Injectable()
export class AlumnoService {
  constructor(
    @Inject('IAlumnoRepository')
    private readonly alumnoRepository: IAlumnoRepository,
    @Inject('INSCRIPCION_GRUPO_REPOSITORY')
    private readonly inscripcionRepository: Repository<InscripcionGrupo>,
  ) {}

  /**
   * Crea un nuevo alumno
   * @param createDto - Datos para crear el alumno
   * @returns Alumno creado
   * @throws ConflictException si ya existe un alumno con la misma matrícula
   */
  async create(createDto: CreateAlumnoDto): Promise<Alumno> {
    try {
      // Validar unicidad de la matrícula
      const existe = await this.alumnoRepository.existsByMatricula(
        createDto.matricula,
      );

      if (existe) {
        throw new ConflictException(
          `Ya existe un alumno con la matrícula "${createDto.matricula}"`,
        );
      }

      return await this.alumnoRepository.create(createDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el alumno');
    }
  }

  /**
   * Obtiene todos los alumnos
   * @returns Lista de alumnos
   */
  async findAll(): Promise<Alumno[]> {
    return await this.alumnoRepository.findAll();
  }

  /**
   * Obtiene un alumno por su ID
   * @param id - ID del alumno a buscar
   * @returns Alumno encontrado
   * @throws NotFoundException si no se encuentra el alumno
   */
  async findOne(id: string): Promise<Alumno> {
    const alumno = await this.alumnoRepository.findById(id);

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    return alumno;
  }

  /**
   * Busca un alumno por su matrícula
   * @param matricula - Matrícula del alumno
   * @returns Alumno encontrado
   * @throws NotFoundException si no se encuentra el alumno
   */
  async findByMatricula(matricula: string): Promise<Alumno> {
    const alumno = await this.alumnoRepository.findByMatricula(matricula);

    if (!alumno) {
      throw new NotFoundException(
        `Alumno con matrícula "${matricula}" no encontrado`,
      );
    }

    return alumno;
  }

  /**
   * Busca alumnos por cuatrimestre actual
   * @param cuatrimestre - Número de cuatrimestre
   * @returns Lista de alumnos del cuatrimestre
   */
  async findByCuatrimestre(cuatrimestre: number): Promise<Alumno[]> {
    return await this.alumnoRepository.findByCuatrimestre(cuatrimestre);
  }

  /**
   * Actualiza un alumno existente
   * Marca automáticamente sincronizado = false (Regla A)
   * @param id - ID del alumno a actualizar
   * @param updateDto - Datos a actualizar
   * @returns Alumno actualizado
   * @throws NotFoundException si no se encuentra el alumno
   * @throws ConflictException si la nueva matrícula ya existe
   */
  async update(id: string, updateDto: UpdateAlumnoDto): Promise<Alumno> {
    // Verificar que el alumno existe
    const alumno = await this.findOne(id);

    // Si se está actualizando la matrícula, verificar unicidad
    if (updateDto.matricula && updateDto.matricula !== alumno.matricula) {
      const existe = await this.alumnoRepository.existsByMatriculaExcludingId(
        updateDto.matricula,
        id,
      );

      if (existe) {
        throw new ConflictException(
          `Ya existe un alumno con la matrícula "${updateDto.matricula}"`,
        );
      }
    }

    // Regla A: El repositorio marca automáticamente sincronizado = false
    return await this.alumnoRepository.update(id, updateDto);
  }

  /**
   * Elimina un alumno (Soft Delete con Regla B)
   * Marca deletedAt y sincronizado = false para notificar al Orquestador
   * @param id - ID del alumno a eliminar
   * @throws NotFoundException si no se encuentra el alumno
   */
  /**
   * Elimina lógicamente un alumno (Soft Delete)
   * CASCADA: También elimina todas las inscripciones del alumno
   * @param id - ID del alumno
   * @throws NotFoundException si no se encuentra el alumno
   */
  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verifica que existe

    // 1. Soft Delete del Alumno
    const result = await this.alumnoRepository.softDelete(id);

    if (result) {
      // 2. INTEGRIDAD: Soft Delete en cascada de las inscripciones de este alumno
      await this.inscripcionRepository.softDelete({ alumnoId: id });

      // 3. Marcar inscripciones como no sincronizadas
      // Para que el Orquestador detecte que debe desmatricular en Moodle
      await this.inscripcionRepository.update(
        { alumnoId: id },
        { sincronizado: false },
      );

      // Nota: El alumno ya se marcó como sincronizado=false en softDelete()
    }
  }

  /**
   * Cuenta el total de alumnos
   * @returns Cantidad total de alumnos
   */
  async count(): Promise<number> {
    return await this.alumnoRepository.count();
  }

  /**
   * Confirma la sincronización exitosa con Moodle
   * Actualiza el moodleUserId y marca sincronizado = true
   * @param id - ID del alumno
   * @param moodleUserId - ID del usuario en Moodle
   * @throws NotFoundException si no se encuentra el alumno
   * IMPORTANTE: Usa save() directo para evitar que el Dirty Flag resetee sincronizado a false
   * CRÍTICO: Incluye withDeleted para poder confirmar bajas (soft deletes)
   */
  async confirmMoodleSync(id: string, moodleUserId: number): Promise<Alumno> {
    // CRÍTICO: Agregar 'withDeleted: true' para poder actualizar registros borrados
    const alumno = await this.alumnoRepository['repository'].findOne({
      where: { id },
      withDeleted: true,
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    // Actualizar campos manualmente y guardar directamente
    // Esto evita pasar por repository.update() que fuerza sincronizado = false
    alumno.moodleUserId = moodleUserId;
    alumno.sincronizado = true;

    // Save directo en el repositorio TypeORM (bypass del método update personalizado)
    const updated = await this.alumnoRepository['repository'].save(alumno);
    return updated;
  }

  /**
   * Obtiene alumnos pendientes de sincronización
   * Retorna alumnos con sincronizado = false y deletedAt = null
   * @returns Lista de alumnos pendientes
   */
  async findPendingSync(): Promise<Alumno[]> {
    return await this.alumnoRepository.findUnsynchronized();
  }

  /**
   * Obtiene alumnos eliminados pendientes de sincronización
   * Retorna alumnos con sincronizado = false y deletedAt != null
   * @returns Lista de alumnos eliminados pendientes
   */
  async findDeletedPendingSync(): Promise<Alumno[]> {
    return await this.alumnoRepository.findDeletedUnsynchronized();
  }
}
