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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InscripcionGrupoService } from '../service/inscripcion-grupo.service';
import {
  CreateInscripcionGrupoDto,
  InscripcionGrupoResponseDto,
} from '../DTOs';

/**
 * Controlador REST para gestión de inscripciones de grupo
 */
@ApiTags('InscripcionGrupo')
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
  @ApiOperation({ summary: 'Inscribir alumno a grupo' })
  @ApiResponse({
    status: 201,
    description: 'Inscripción creada exitosamente',
    type: InscripcionGrupoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Grupo o alumno no encontrado' })
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
  @ApiOperation({ summary: 'Obtener todas las inscripciones activas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de inscripciones',
    type: [InscripcionGrupoResponseDto],
  })
  async findAll(): Promise<InscripcionGrupoResponseDto[]> {
    return await this.inscripcionGrupoService.findAll();
  }

  /**
   * GET /inscripciones-grupo/:id
   * Obtiene una inscripción por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener inscripción por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la inscripción' })
  @ApiResponse({
    status: 200,
    description: 'Inscripción encontrada',
    type: InscripcionGrupoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
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
  @ApiOperation({ summary: 'Obtener inscripciones de un grupo' })
  @ApiParam({ name: 'grupoId', description: 'UUID del grupo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de inscripciones del grupo',
    type: [InscripcionGrupoResponseDto],
  })
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
  @ApiOperation({ summary: 'Obtener inscripciones de un alumno' })
  @ApiParam({ name: 'alumnoId', description: 'UUID del alumno' })
  @ApiResponse({
    status: 200,
    description: 'Lista de inscripciones del alumno',
    type: [InscripcionGrupoResponseDto],
  })
  async findByAlumno(
    @Param('alumnoId', ParseUUIDPipe) alumnoId: string,
  ): Promise<InscripcionGrupoResponseDto[]> {
    return await this.inscripcionGrupoService.findByAlumno(alumnoId);
  }

  /**
   * GET /inscripciones-grupo/sync/pending
   * Obtiene inscripciones no sincronizadas (para Orquestador)
   */
  @Get('sync/pending')
  @ApiOperation({
    summary: 'Obtener inscripciones pendientes de sincronización',
    description:
      'Endpoint para el Orquestador - Retorna inscripciones con sincronizado=false y deletedAt=null',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de inscripciones pendientes',
    type: [InscripcionGrupoResponseDto],
  })
  async findUnsynchronized(): Promise<InscripcionGrupoResponseDto[]> {
    return await this.inscripcionGrupoService.findUnsynchronized();
  }

  /**
   * GET /inscripciones-grupo/sync/deleted
   * Obtiene inscripciones eliminadas no sincronizadas
   */
  @Get('sync/deleted')
  @ApiOperation({
    summary: 'Obtener inscripciones eliminadas pendientes de sincronización',
    description:
      'Endpoint para el Orquestador - Retorna inscripciones con sincronizado=false y deletedAt NOT NULL',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de inscripciones eliminadas pendientes',
    type: [InscripcionGrupoResponseDto],
  })
  async findDeletedUnsynchronized(): Promise<InscripcionGrupoResponseDto[]> {
    return await this.inscripcionGrupoService.findDeletedUnsynchronized();
  }

  /**
   * DELETE /inscripciones-grupo/:id
   * Desinscribe un alumno de un grupo (Soft Delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desinscribir alumno de grupo (Soft Delete)' })
  @ApiParam({ name: 'id', description: 'UUID de la inscripción' })
  @ApiResponse({
    status: 204,
    description: 'Inscripción eliminada exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.inscripcionGrupoService.remove(id);
  }

  /**
   * POST /inscripciones-grupo/:id/sync
   * Marca una inscripción como sincronizada
   */
  @Post(':id/sync')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Confirmar sincronización de inscripción',
    description:
      'Endpoint para el Orquestador - Marca sincronizado=true después de procesar en Moodle',
  })
  @ApiParam({ name: 'id', description: 'UUID de la inscripción' })
  @ApiResponse({
    status: 204,
    description: 'Inscripción marcada como sincronizada',
  })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  async markAsSynchronized(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.inscripcionGrupoService.markAsSynchronized(id);
  }
}
