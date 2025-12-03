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
import { AlumnoService } from '../service/alumno.service';
import { CreateAlumnoDto, UpdateAlumnoDto, AlumnoResponseDto } from '../DTOs';
import { Alumno } from '../entities/alumno.entity';

/**
 * Controlador REST para gestión de Alumnos
 * Expone endpoints CRUD completos con documentación Swagger
 */
@ApiTags('Alumnos')
@Controller('alumno')
export class AlumnoController {
  constructor(private readonly alumnoService: AlumnoService) {}

  /**
   * Crea un nuevo alumno
   */
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo alumno',
    description:
      'Crea un nuevo alumno con los datos proporcionados. La matrícula debe ser única.',
  })
  @ApiBody({ type: CreateAlumnoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Alumno creado exitosamente',
    type: AlumnoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Ya existe un alumno con la misma matrícula',
  })
  async create(@Body() createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    return await this.alumnoService.create(createAlumnoDto);
  }

  /**
   * Obtiene todos los alumnos
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los alumnos',
    description:
      'Retorna una lista de todos los alumnos ordenados por fecha de creación (más recientes primero). Si no hay alumnos, retorna 204 No Content.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de alumnos obtenida exitosamente',
    type: [AlumnoResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'No hay alumnos registrados',
  })
  async findAll(
    @Res({ passthrough: true }) res: Response,
  ): Promise<Alumno[] | void> {
    const alumnos = await this.alumnoService.findAll();

    if (alumnos.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return alumnos;
  }

  /**
   * Obtiene la cantidad total de alumnos
   */
  @Get('count')
  @ApiOperation({
    summary: 'Contar alumnos',
    description: 'Retorna el número total de alumnos registrados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cantidad de alumnos obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 150 },
      },
    },
  })
  async count(): Promise<{ count: number }> {
    const count = await this.alumnoService.count();
    return { count };
  }

  /**
   * Busca alumnos por cuatrimestre
   */
  @Get('cuatrimestre/:cuatrimestre')
  @ApiOperation({
    summary: 'Buscar alumnos por cuatrimestre',
    description:
      'Retorna todos los alumnos que cursan un cuatrimestre específico',
  })
  @ApiParam({
    name: 'cuatrimestre',
    type: 'number',
    description: 'Número de cuatrimestre',
    example: 3,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de alumnos del cuatrimestre',
    type: [AlumnoResponseDto],
  })
  async findByCuatrimestre(
    @Param('cuatrimestre', ParseIntPipe) cuatrimestre: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Alumno[] | void> {
    const alumnos = await this.alumnoService.findByCuatrimestre(cuatrimestre);

    if (alumnos.length === 0) {
      res.status(HttpStatus.NO_CONTENT);
      return;
    }

    return alumnos;
  }

  /**
   * Busca un alumno por matrícula
   */
  @Get('matricula/:matricula')
  @ApiOperation({
    summary: 'Buscar alumno por matrícula',
    description: 'Retorna un alumno específico por su matrícula',
  })
  @ApiParam({
    name: 'matricula',
    type: 'string',
    description: 'Matrícula del alumno',
    example: 'A20240001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alumno encontrado',
    type: AlumnoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Alumno no encontrado',
  })
  async findByMatricula(
    @Param('matricula') matricula: string,
  ): Promise<Alumno> {
    return await this.alumnoService.findByMatricula(matricula);
  }

  /**
   * Obtiene un alumno por su ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un alumno por ID',
    description: 'Retorna los detalles de un alumno específico',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del alumno',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alumno encontrado',
    type: AlumnoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Alumno no encontrado',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Alumno> {
    return await this.alumnoService.findOne(id);
  }

  /**
   * Actualiza un alumno existente
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un alumno',
    description: 'Actualiza parcialmente los datos de un alumno existente',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del alumno a actualizar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateAlumnoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Alumno actualizado exitosamente',
    type: AlumnoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Alumno no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'La nueva matrícula ya está en uso',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlumnoDto: UpdateAlumnoDto,
  ): Promise<Alumno> {
    return await this.alumnoService.update(id, updateAlumnoDto);
  }

  /**
   * Elimina un alumno
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un alumno',
    description: 'Elimina permanentemente un alumno',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'UUID del alumno a eliminar',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Alumno eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Alumno no encontrado',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.alumnoService.remove(id);
  }
}
