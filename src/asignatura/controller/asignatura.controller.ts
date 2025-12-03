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
  ParseIntPipe,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AsignaturaService } from '../service/asignatura.service';
import {
  CreateAsignaturaDto,
  UpdateAsignaturaDto,
  AsignaturaResponseDto,
} from '../DTOs';
import { Asignatura } from '../entities/asignatura.entity';

/**
 * Controlador REST para gestión de Asignaturas
 * Expone endpoints CRUD completos con documentación Swagger
 */
@ApiTags('Asignaturas')
@Controller('asignatura')
export class AsignaturaController {
  constructor(private readonly asignaturaService: AsignaturaService) {}

  /**
   * Crea una nueva asignatura
   */
  @Post()
  @ApiOperation({
    summary: 'Crear una nueva asignatura',
    description:
      'Crea una nueva asignatura asociada a un programa de estudio. Valida que el cuatrimestre no exceda el límite del programa.',
  })
  @ApiBody({ type: CreateAsignaturaDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Asignatura creada exitosamente',
    type: AsignaturaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos o cuatrimestre excede el límite',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programa de estudio no encontrado',
  })
  async create(
    @Body() createAsignaturaDto: CreateAsignaturaDto,
  ): Promise<Asignatura> {
    return await this.asignaturaService.create(createAsignaturaDto);
  }

  /**
   * Obtiene todas las asignaturas
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todas las asignaturas',
    description:
      'Retorna una lista de todas las asignaturas ordenadas por cuatrimestre y nombre. Incluye la relación con programa de estudio.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de asignaturas obtenida exitosamente',
    type: [AsignaturaResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No hay asignaturas registradas',
  })
  async findAll(
    @Res({ passthrough: true }) res: Response,
  ): Promise<Asignatura[] | void> {
    const asignaturas = await this.asignaturaService.findAll();

    if (asignaturas.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return asignaturas;
  }

  /**
   * Obtiene la cantidad total de asignaturas
   */
  @Get('count')
  @ApiOperation({
    summary: 'Contar asignaturas',
    description: 'Retorna el número total de asignaturas registradas',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cantidad de asignaturas obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 45 },
      },
    },
  })
  async count(): Promise<{ count: number }> {
    const count = await this.asignaturaService.count();
    return { count };
  }

  /**
   * Busca asignaturas por cuatrimestre
   */
  @Get('cuatrimestre/:cuatrimestre')
  @ApiOperation({
    summary: 'Buscar asignaturas por cuatrimestre',
    description: 'Retorna todas las asignaturas de un cuatrimestre específico',
  })
  @ApiParam({
    name: 'cuatrimestre',
    type: 'number',
    description: 'Número de cuatrimestre',
    example: 3,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de asignaturas del cuatrimestre',
    type: [AsignaturaResponseDto],
  })
  async findByCuatrimestre(
    @Param('cuatrimestre', ParseIntPipe) cuatrimestre: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Asignatura[] | void> {
    const asignaturas =
      await this.asignaturaService.findByCuatrimestre(cuatrimestre);

    if (asignaturas.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return asignaturas;
  }

  /**
   * Busca asignaturas por programa de estudio
   */
  @Get('programa/:programaId')
  @ApiOperation({
    summary: 'Buscar asignaturas por programa de estudio',
    description:
      'Retorna todas las asignaturas de un programa de estudio específico',
  })
  @ApiParam({
    name: 'programaId',
    type: 'string',
    description: 'UUID del programa de estudio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de asignaturas del programa',
    type: [AsignaturaResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programa de estudio no encontrado',
  })
  async findByProgramaEstudio(
    @Param('programaId', ParseUUIDPipe) programaId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Asignatura[] | void> {
    const asignaturas =
      await this.asignaturaService.findByProgramaEstudio(programaId);

    if (asignaturas.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return asignaturas;
  }

  /**
   * Busca asignaturas por cuatrimestre y programa
   */
  @Get('programa/:programaId/cuatrimestre/:cuatrimestre')
  @ApiOperation({
    summary: 'Buscar asignaturas por cuatrimestre y programa',
    description:
      'Retorna asignaturas filtradas por cuatrimestre y programa de estudio',
  })
  @ApiParam({
    name: 'programaId',
    type: 'string',
    description: 'UUID del programa de estudio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'cuatrimestre',
    type: 'number',
    description: 'Número de cuatrimestre',
    example: 3,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de asignaturas filtradas',
    type: [AsignaturaResponseDto],
  })
  async findByCuatrimestreAndPrograma(
    @Param('programaId', ParseUUIDPipe) programaId: string,
    @Param('cuatrimestre', ParseIntPipe) cuatrimestre: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Asignatura[] | void> {
    const asignaturas =
      await this.asignaturaService.findByCuatrimestreAndPrograma(
        cuatrimestre,
        programaId,
      );

    if (asignaturas.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return asignaturas;
  }

  /**
   * Cuenta asignaturas por programa de estudio
   */
  @Get('programa/:programaId/count')
  @ApiOperation({
    summary: 'Contar asignaturas por programa de estudio',
    description: 'Retorna el número de asignaturas de un programa específico',
  })
  @ApiParam({
    name: 'programaId',
    type: 'string',
    description: 'UUID del programa de estudio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cantidad de asignaturas del programa',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 12 },
      },
    },
  })
  async countByProgramaEstudio(
    @Param('programaId', ParseUUIDPipe) programaId: string,
  ): Promise<{ count: number }> {
    const count =
      await this.asignaturaService.countByProgramaEstudio(programaId);
    return { count };
  }

  /**
   * Obtiene una asignatura por su ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una asignatura por ID',
    description: 'Retorna los detalles de una asignatura específica',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID de la asignatura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Asignatura encontrada',
    type: AsignaturaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Asignatura no encontrada',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Asignatura> {
    return await this.asignaturaService.findOne(id);
  }

  /**
   * Actualiza una asignatura existente
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una asignatura',
    description:
      'Actualiza parcialmente los datos de una asignatura existente. Valida que el cuatrimestre no exceda el límite del programa.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID de la asignatura a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateAsignaturaDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Asignatura actualizada exitosamente',
    type: AsignaturaResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Asignatura o programa de estudio no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cuatrimestre excede el límite del programa',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAsignaturaDto: UpdateAsignaturaDto,
  ): Promise<Asignatura> {
    return await this.asignaturaService.update(id, updateAsignaturaDto);
  }

  /**
   * Elimina una asignatura
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar una asignatura',
    description: 'Elimina permanentemente una asignatura',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID de la asignatura a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Asignatura eliminada exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Asignatura no encontrada',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.asignaturaService.remove(id);
  }
}
