import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InscripcionGrupoService } from '../service/inscripcion-grupo.service';
import {
  CreateInscripcionGrupoDto,
  InscripcionGrupoResponseDto,
} from '../DTOs';

/**
 * Controlador REST para gestión de inscripciones de grupo
 */
@Controller('inscripciones-grupo')
export class InscripcionGrupoController {
  constructor(
    private readonly inscripcionGrupoService: InscripcionGrupoService,
  ) {}

  /**
   * POST /inscripciones-grupo
   * Inscribe un alumno a un grupo
   */
  @Post()
  async create(
    @Body() createDto: CreateInscripcionGrupoDto,
  ): Promise<InscripcionGrupoResponseDto> {
    return await this.inscripcionGrupoService.create(createDto);
  }

  /**
   * GET /inscripciones-grupo
   * Obtiene todas las inscripciones activas
   */
  @Get()
  async findAll(): Promise<InscripcionGrupoResponseDto[]> {
    return await this.inscripcionGrupoService.findAll();
  }

  /**
   * GET /inscripciones-grupo/:id
   * Obtiene una inscripción por ID
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InscripcionGrupoResponseDto> {
    return await this.inscripcionGrupoService.findOne(id);
  }

  /**
   * GET /inscripciones-grupo/grupo/:grupoId
   * Obtiene inscripciones de un grupo
   */
  @Get('grupo/:grupoId')
  async findByGrupo(
    @Param('grupoId', ParseUUIDPipe) grupoId: string,
  ): Promise<InscripcionGrupoResponseDto[]> {
    return await this.inscripcionGrupoService.findByGrupo(grupoId);
  }

  /**
   * GET /inscripciones-grupo/alumno/:alumnoId
   * Obtiene inscripciones de un alumno
   */
  @Get('alumno/:alumnoId')
  async findByAlumno(
    @Param('alumnoId', ParseUUIDPipe) alumnoId: string,
  ): Promise<InscripcionGrupoResponseDto[]> {
    return await this.inscripcionGrupoService.findByAlumno(alumnoId);
  }

  /**
   * GET /inscripciones-grupo/unsynchronized
   * Obtiene inscripciones no sincronizadas (para Orquestador)
   */
  @Get('sync/pending')
  async findUnsynchronized(): Promise<InscripcionGrupoResponseDto[]> {
    return await this.inscripcionGrupoService.findUnsynchronized();
  }

  /**
   * GET /inscripciones-grupo/sync/deleted
   * Obtiene inscripciones eliminadas no sincronizadas
   */
  @Get('sync/deleted')
  async findDeletedUnsynchronized(): Promise<InscripcionGrupoResponseDto[]> {
    return await this.inscripcionGrupoService.findDeletedUnsynchronized();
  }

  /**
   * DELETE /inscripciones-grupo/:id
   * Desinscribe un alumno de un grupo (Soft Delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.inscripcionGrupoService.remove(id);
  }

  /**
   * POST /inscripciones-grupo/:id/sync
   * Marca una inscripción como sincronizada
   */
  @Post(':id/sync')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAsSynchronized(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.inscripcionGrupoService.markAsSynchronized(id);
  }
}
