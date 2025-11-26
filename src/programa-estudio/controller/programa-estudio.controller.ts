import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
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
      'Retorna una lista de todos los programas de estudio ordenados por fecha de creación (más recientes primero)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de programas de estudio obtenida exitosamente',
    type: [ProgramaEstudioResponseDto],
  })
  async findAll(): Promise<ProgramaEstudio[]> {
    return await this.programaEstudioService.findAll();
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
    type: 'number',
    description: 'ID del programa de estudio',
    example: 1,
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
    @Param('id', ParseIntPipe) id: number,
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
    type: 'number',
    description: 'ID del programa de estudio a actualizar',
    example: 1,
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
    @Param('id', ParseIntPipe) id: number,
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
    type: 'number',
    description: 'ID del programa de estudio a eliminar',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Programa de estudio eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Programa de estudio no encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.programaEstudioService.remove(id);
  }
}
