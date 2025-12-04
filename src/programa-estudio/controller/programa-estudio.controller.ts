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
import { ProgramaEstudioService } from '../service/programa-estudio.service';
import {
  CreateProgramaEstudioDto,
  UpdateProgramaEstudioDto,
  ProgramaEstudioResponseDto,
} from '../DTOs';
import { ProgramaEstudio } from '../entities/programa-estudio.entity';

/**
 * Controlador REST para gestión de Programas de Estudio
 * Expone endpoints CRUD completos con documentación Swagger
 */
@ApiTags('Programa de Estudio')
@Controller('programa-estudio')
export class ProgramaEstudioController {
  constructor(
    private readonly programaEstudioService: ProgramaEstudioService,
  ) {}

  /**
   * Crea un nuevo programa de estudio
   */
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo programa de estudio',
    description:
      'Crea un nuevo programa de estudio con los datos proporcionados. El nombre debe ser único.',
  })
  @ApiBody({ type: CreateProgramaEstudioDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Programa de estudio creado exitosamente',
    type: ProgramaEstudioResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe un programa con el mismo nombre',
  })
  async create(
    @Body() createProgramaEstudioDto: CreateProgramaEstudioDto,
  ): Promise<ProgramaEstudio> {
    return await this.programaEstudioService.create(createProgramaEstudioDto);
  }

  /**
   * Obtiene todos los programas de estudio
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los programas de estudio',
    description:
      'Retorna una lista de todos los programas de estudio ordenados por fecha de creación (más recientes primero). Si no hay programas, retorna 204 No Content.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de programas de estudio obtenida exitosamente',
    type: [ProgramaEstudioResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No hay programas de estudio registrados',
  })
  async findAll(
    @Res({ passthrough: true }) res: Response,
  ): Promise<ProgramaEstudio[] | void> {
    const programas = await this.programaEstudioService.findAll();

    if (programas.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return programas;
  }

  /**
   * Obtiene la cantidad total de programas de estudio
   */
  @Get('count')
  @ApiOperation({
    summary: 'Contar programas de estudio',
    description: 'Retorna el número total de programas de estudio registrados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cantidad de programas obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 5 },
      },
    },
  })
  async count(): Promise<{ count: number }> {
    const count = await this.programaEstudioService.count();
    return { count };
  }

  /**
   * Obtiene un programa de estudio por su ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un programa de estudio por ID',
    description: 'Retorna los detalles de un programa de estudio específico',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del programa de estudio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Programa de estudio encontrado',
    type: ProgramaEstudioResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programa de estudio no encontrado',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProgramaEstudio> {
    return await this.programaEstudioService.findOne(id);
  }

  /**
   * Actualiza un programa de estudio existente
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un programa de estudio',
    description:
      'Actualiza parcialmente los datos de un programa de estudio existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del programa de estudio a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateProgramaEstudioDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Programa de estudio actualizado exitosamente',
    type: ProgramaEstudioResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programa de estudio no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El nuevo nombre ya está en uso',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProgramaEstudioDto: UpdateProgramaEstudioDto,
  ): Promise<ProgramaEstudio> {
    return await this.programaEstudioService.update(
      id,
      updateProgramaEstudioDto,
    );
  }

  /**
   * Elimina un programa de estudio
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un programa de estudio',
    description: 'Elimina permanentemente un programa de estudio',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del programa de estudio a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Programa de estudio eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programa de estudio no encontrado',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.programaEstudioService.remove(id);
  }

  /**
   * Confirma la sincronización exitosa con Moodle
   */
  @Post(':id/sync')
  @ApiOperation({
    summary: 'Confirmar sincronización con Moodle',
    description:
      'Endpoint llamado por el Orquestador para confirmar que el programa de estudio fue sincronizado exitosamente en Moodle. Actualiza el moodleCategoryId y marca sincronizado = true.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del programa de estudio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        moodleCategoryId: {
          type: 'number',
          description: 'ID de la categoría en Moodle',
          example: 12,
        },
      },
      required: ['moodleCategoryId'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sincronización confirmada exitosamente',
    type: ProgramaEstudioResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programa de estudio no encontrado',
  })
  async confirmSync(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('moodleCategoryId') moodleCategoryId: number,
  ): Promise<ProgramaEstudio> {
    return await this.programaEstudioService.confirmMoodleSync(
      id,
      moodleCategoryId,
    );
  }

  /**
   * Obtiene programas pendientes de sincronización
   */
  @Get('sync/pending')
  @ApiOperation({
    summary: 'Obtener programas pendientes de sincronización',
    description:
      'Retorna programas que han sido creados o modificados y aún no han sido sincronizados con Moodle (sincronizado = false y deletedAt = null).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de programas pendientes',
    type: [ProgramaEstudioResponseDto],
  })
  async findPendingSync(
    @Res({ passthrough: true }) res: Response,
  ): Promise<ProgramaEstudio[] | void> {
    const programas = await this.programaEstudioService.findPendingSync();

    if (programas.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return programas;
  }

  /**
   * Obtiene programas eliminados pendientes de sincronización
   */
  @Get('sync/deleted')
  @ApiOperation({
    summary: 'Obtener programas eliminados pendientes de sincronización',
    description:
      'Retorna programas que han sido eliminados lógicamente y aún no han sido eliminados en Moodle (sincronizado = false y deletedAt != null).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de programas eliminados pendientes',
    type: [ProgramaEstudioResponseDto],
  })
  async findDeletedPendingSync(
    @Res({ passthrough: true }) res: Response,
  ): Promise<ProgramaEstudio[] | void> {
    const programas =
      await this.programaEstudioService.findDeletedPendingSync();

    if (programas.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return programas;
  }
}
