import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseUUIDPipe,
  HttpCode,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { DocenteService } from '../service/docente.service';
import {
  CreateDocenteDto,
  UpdateDocenteDto,
  DocenteResponseDto,
} from '../DTOs';
import { Docente } from '../entities/docente.entity';

/**
 * Controlador REST para gestión de Docentes
 * Expone endpoints CRUD completos con documentación Swagger
 * Incluye gestión de competencias (asignaturas que puede impartir)
 */
@ApiTags('Docentes')
@Controller('docente')
export class DocenteController {
  constructor(private readonly docenteService: DocenteService) {}

  /**
   * Crea un nuevo docente
   */
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo docente',
    description:
      'Crea un nuevo docente con sus competencias (asignaturas que puede impartir). Las competencias son opcionales al crear.',
  })
  @ApiBody({ type: CreateDocenteDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Docente creado exitosamente',
    type: DocenteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Alguna asignatura especificada no existe',
  })
  async create(@Body() createDocenteDto: CreateDocenteDto): Promise<Docente> {
    return await this.docenteService.create(createDocenteDto);
  }

  /**
   * Obtiene todos los docentes
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los docentes',
    description:
      'Retorna una lista de todos los docentes ordenados alfabéticamente. Incluye sus competencias (asignaturas).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de docentes obtenida exitosamente',
    type: [DocenteResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No hay docentes registrados',
  })
  async findAll(
    @Res({ passthrough: true }) res: Response,
  ): Promise<Docente[] | void> {
    const docentes = await this.docenteService.findAll();

    if (docentes.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return docentes;
  }

  /**
   * Obtiene la cantidad total de docentes
   */
  @Get('count')
  @ApiOperation({
    summary: 'Contar docentes',
    description: 'Retorna el número total de docentes registrados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cantidad de docentes obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 25 },
      },
    },
  })
  async count(): Promise<{ count: number }> {
    const count = await this.docenteService.count();
    return { count };
  }

  /**
   * Busca docentes que pueden impartir una asignatura
   */
  @Get('asignatura/:asignaturaId')
  @ApiOperation({
    summary: 'Buscar docentes por competencia en asignatura',
    description:
      'Retorna todos los docentes que tienen competencia para impartir una asignatura específica',
  })
  @ApiParam({
    name: 'asignaturaId',
    type: 'string',
    description: 'UUID de la asignatura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de docentes competentes',
    type: [DocenteResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Asignatura no encontrada',
  })
  async findByAsignaturaCompetencia(
    @Param('asignaturaId', ParseUUIDPipe) asignaturaId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Docente[] | void> {
    const docentes =
      await this.docenteService.findByAsignaturaCompetencia(asignaturaId);

    if (docentes.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return docentes;
  }

  /**
   * Obtiene un docente por su ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un docente por ID',
    description:
      'Retorna los detalles de un docente específico con sus competencias y relaciones completas',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del docente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Docente encontrado',
    type: DocenteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Docente no encontrado',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Docente> {
    return await this.docenteService.findOne(id);
  }

  /**
   * Actualiza un docente existente
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un docente',
    description:
      'Actualiza parcialmente los datos de un docente existente. Puede actualizar nombre y/o competencias.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del docente a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateDocenteDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Docente actualizado exitosamente',
    type: DocenteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Docente o alguna asignatura no encontrada',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDocenteDto: UpdateDocenteDto,
  ): Promise<Docente> {
    return await this.docenteService.update(id, updateDocenteDto);
  }

  /**
   * Elimina un docente
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un docente',
    description: 'Elimina permanentemente un docente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del docente a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Docente eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Docente no encontrado',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.docenteService.remove(id);
  }

  /**
   * Agrega una competencia a un docente
   */
  @Post(':id/competencia/:asignaturaId')
  @ApiOperation({
    summary: 'Agregar competencia a docente',
    description:
      'Agrega una asignatura a las competencias del docente (asignaturas que puede impartir)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del docente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'asignaturaId',
    type: 'string',
    description: 'UUID de la asignatura',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Competencia agregada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Docente o asignatura no encontrada',
  })
  async addCompetencia(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('asignaturaId', ParseUUIDPipe) asignaturaId: string,
  ): Promise<{ message: string }> {
    await this.docenteService.addCompetencia(id, asignaturaId);
    return { message: 'Competencia agregada exitosamente' };
  }

  /**
   * Remueve una competencia de un docente
   */
  @Delete(':id/competencia/:asignaturaId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remover competencia de docente',
    description: 'Remueve una asignatura de las competencias del docente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del docente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'asignaturaId',
    type: 'string',
    description: 'UUID de la asignatura',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Competencia removida exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Docente no encontrado',
  })
  async removeCompetencia(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('asignaturaId', ParseUUIDPipe) asignaturaId: string,
  ): Promise<{ message: string }> {
    await this.docenteService.removeCompetencia(id, asignaturaId);
    return { message: 'Competencia removida exitosamente' };
  }

  /**
   * Actualiza las competencias de un docente (reemplaza todas)
   */
  @Patch(':id/competencias')
  @ApiOperation({
    summary: 'Actualizar competencias de docente',
    description:
      'Reemplaza todas las competencias del docente con la lista proporcionada',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del docente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        asignaturaIds: {
          type: 'array',
          items: { type: 'string' },
          example: [
            '550e8400-e29b-41d4-a716-446655440000',
            '660e8400-e29b-41d4-a716-446655440001',
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Competencias actualizadas exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Docente o alguna asignatura no encontrada',
  })
  async updateCompetencias(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('asignaturaIds') asignaturaIds: string[],
  ): Promise<{ message: string }> {
    await this.docenteService.updateCompetencias(id, asignaturaIds);
    return { message: 'Competencias actualizadas exitosamente' };
  }

  /**
   * Confirma la sincronización exitosa con Moodle
   */
  @Post(':id/sync')
  @ApiOperation({
    summary: 'Confirmar sincronización con Moodle',
    description:
      'Endpoint llamado por el Orquestador para confirmar que el docente fue sincronizado exitosamente en Moodle. Actualiza el moodleUserId y marca sincronizado = true.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del docente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        moodleUserId: {
          type: 'number',
          description: 'ID del usuario en Moodle',
          example: 45,
        },
      },
      required: ['moodleUserId'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sincronización confirmada exitosamente',
    type: DocenteResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Docente no encontrado',
  })
  async confirmSync(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('moodleUserId') moodleUserId: number,
  ): Promise<Docente> {
    return await this.docenteService.confirmMoodleSync(id, moodleUserId);
  }

  /**
   * Obtiene docentes pendientes de sincronización
   */
  @Get('sync/pending')
  @ApiOperation({
    summary: 'Obtener docentes pendientes de sincronización',
    description:
      'Retorna docentes que han sido creados o modificados y aún no han sido sincronizados con Moodle (sincronizado = false y deletedAt = null).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de docentes pendientes',
    type: [DocenteResponseDto],
  })
  async findPendingSync(
    @Res({ passthrough: true }) res: Response,
  ): Promise<Docente[] | void> {
    const docentes = await this.docenteService.findPendingSync();

    if (docentes.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return docentes;
  }

  /**
   * Obtiene docentes eliminados pendientes de sincronización
   */
  @Get('sync/deleted')
  @ApiOperation({
    summary: 'Obtener docentes eliminados pendientes de sincronización',
    description:
      'Retorna docentes que han sido eliminados lógicamente y aún no han sido eliminados en Moodle (sincronizado = false y deletedAt != null).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de docentes eliminados pendientes',
    type: [DocenteResponseDto],
  })
  async findDeletedPendingSync(
    @Res({ passthrough: true }) res: Response,
  ): Promise<Docente[] | void> {
    const docentes = await this.docenteService.findDeletedPendingSync();

    if (docentes.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return docentes;
  }
}
