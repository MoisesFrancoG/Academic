import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GrupoService } from '../service/grupo.service';
import { CreateGrupoDto, UpdateGrupoDto, GrupoResponseDto } from '../DTOs';

/**
 * Controlador para gestión de grupos
 */
@ApiTags('Grupos')
@Controller('grupo')
export class GrupoController {
  constructor(private readonly grupoService: GrupoService) {}

  /**
   * Crea un nuevo grupo
   */
  @Post()
  @ApiOperation({
    summary: 'Crear grupo',
    description:
      'Crea un nuevo grupo validando que la asignatura y el docente existan, ' +
      'y que el docente tenga competencia en la asignatura. Opcionalmente inscribe alumnos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Grupo creado exitosamente',
    type: GrupoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o docente sin competencia en la asignatura',
  })
  @ApiResponse({
    status: 404,
    description: 'Asignatura, docente o alumno no encontrado',
  })
  async create(
    @Body() createGrupoDto: CreateGrupoDto,
  ): Promise<GrupoResponseDto> {
    return await this.grupoService.create(createGrupoDto);
  }

  /**
   * Obtiene un grupo por ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener grupo por ID',
    description:
      'Obtiene un grupo específico con sus relaciones (asignatura, docente, alumnos)',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del grupo',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo encontrado',
    type: GrupoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo no encontrado',
  })
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GrupoResponseDto> {
    return await this.grupoService.findById(id);
  }

  /**
   * Obtiene todos los grupos
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los grupos',
    description: 'Obtiene la lista completa de grupos con sus relaciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos',
    type: [GrupoResponseDto],
  })
  async findAll(): Promise<GrupoResponseDto[]> {
    return await this.grupoService.findAll();
  }

  /**
   * Actualiza un grupo
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar grupo',
    description:
      'Actualiza un grupo existente. Si cambia asignatura o docente, ' +
      'valida que el docente tenga competencia en la asignatura.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del grupo',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo actualizado exitosamente',
    type: GrupoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o docente sin competencia en la asignatura',
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo, asignatura, docente o alumno no encontrado',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGrupoDto: UpdateGrupoDto,
  ): Promise<GrupoResponseDto> {
    return await this.grupoService.update(id, updateGrupoDto);
  }

  /**
   * Elimina un grupo
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar grupo',
    description: 'Elimina un grupo de forma permanente',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del grupo',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Grupo eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo no encontrado',
  })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.grupoService.delete(id);
  }

  /**
   * Cuenta el total de grupos
   */
  @Get('stats/count')
  @ApiOperation({
    summary: 'Contar grupos',
    description: 'Obtiene el número total de grupos registrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Número total de grupos',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 42,
        },
      },
    },
  })
  async count(): Promise<{ count: number }> {
    const count = await this.grupoService.count();
    return { count };
  }

  /**
   * Busca grupos por asignatura
   */
  @Get('filter/asignatura/:asignaturaId')
  @ApiOperation({
    summary: 'Buscar grupos por asignatura',
    description:
      'Obtiene todos los grupos que imparten una asignatura específica',
  })
  @ApiParam({
    name: 'asignaturaId',
    description: 'UUID de la asignatura',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos de la asignatura',
    type: [GrupoResponseDto],
  })
  async findByAsignatura(
    @Param('asignaturaId', ParseUUIDPipe) asignaturaId: string,
  ): Promise<GrupoResponseDto[]> {
    return await this.grupoService.findByAsignatura(asignaturaId);
  }

  /**
   * Busca grupos por docente
   */
  @Get('filter/docente/:docenteId')
  @ApiOperation({
    summary: 'Buscar grupos por docente',
    description: 'Obtiene todos los grupos asignados a un docente específico',
  })
  @ApiParam({
    name: 'docenteId',
    description: 'UUID del docente',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos del docente',
    type: [GrupoResponseDto],
  })
  async findByDocente(
    @Param('docenteId', ParseUUIDPipe) docenteId: string,
  ): Promise<GrupoResponseDto[]> {
    return await this.grupoService.findByDocente(docenteId);
  }

  /**
   * Busca grupos por alumno
   */
  @Get('filter/alumno/:alumnoId')
  @ApiOperation({
    summary: 'Buscar grupos por alumno',
    description: 'Obtiene todos los grupos en los que está inscrito un alumno',
  })
  @ApiParam({
    name: 'alumnoId',
    description: 'UUID del alumno',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos del alumno',
    type: [GrupoResponseDto],
  })
  async findByAlumno(
    @Param('alumnoId', ParseUUIDPipe) alumnoId: string,
  ): Promise<GrupoResponseDto[]> {
    return await this.grupoService.findByAlumno(alumnoId);
  }

  /**
   * Añade un alumno a un grupo
   */
  @Post(':id/alumno/:alumnoId')
  @ApiOperation({
    summary: 'Inscribir alumno en grupo',
    description: 'Añade un alumno a un grupo existente',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del grupo',
    type: String,
  })
  @ApiParam({
    name: 'alumnoId',
    description: 'UUID del alumno a inscribir',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Alumno inscrito exitosamente',
    type: GrupoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo o alumno no encontrado',
  })
  async addAlumno(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('alumnoId', ParseUUIDPipe) alumnoId: string,
  ): Promise<GrupoResponseDto> {
    return await this.grupoService.addAlumno(id, alumnoId);
  }

  /**
   * Elimina un alumno de un grupo
   */
  @Delete(':id/alumno/:alumnoId')
  @ApiOperation({
    summary: 'Dar de baja alumno de grupo',
    description: 'Elimina un alumno de un grupo',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del grupo',
    type: String,
  })
  @ApiParam({
    name: 'alumnoId',
    description: 'UUID del alumno a dar de baja',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Alumno dado de baja exitosamente',
    type: GrupoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo no encontrado',
  })
  async removeAlumno(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('alumnoId', ParseUUIDPipe) alumnoId: string,
  ): Promise<GrupoResponseDto> {
    return await this.grupoService.removeAlumno(id, alumnoId);
  }

  /**
   * Actualiza la lista completa de alumnos de un grupo
   */
  @Patch(':id/alumnos')
  @ApiOperation({
    summary: 'Actualizar lista de alumnos',
    description: 'Reemplaza la lista completa de alumnos inscritos en un grupo',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del grupo',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de alumnos actualizada exitosamente',
    type: GrupoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo o uno o más alumnos no encontrados',
  })
  async updateAlumnos(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { alumnoIds: string[] },
  ): Promise<GrupoResponseDto> {
    return await this.grupoService.updateAlumnos(id, body.alumnoIds);
  }

  /**
   * Cuenta el número de alumnos en un grupo
   */
  @Get(':id/alumnos/count')
  @ApiOperation({
    summary: 'Contar alumnos en grupo',
    description: 'Obtiene el número de alumnos inscritos en un grupo',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del grupo',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Número de alumnos en el grupo',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 25,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo no encontrado',
  })
  async countAlumnos(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ count: number }> {
    const count = await this.grupoService.countAlumnos(id);
    return { count };
  }
}
