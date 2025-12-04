import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para inscripciones de grupo
 * Incluye información completa de la inscripción
 */
export class InscripcionGrupoResponseDto {
  @ApiProperty({
    description: 'ID único de la inscripción (UUID)',
    example: '770e8400-e29b-41d4-a716-446655440003',
  })
  id: string;

  @ApiProperty({
    description: 'UUID del grupo',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  grupoId: string;

  @ApiProperty({
    description: 'UUID del alumno',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  alumnoId: string;

  @ApiProperty({
    description: 'Bandera de sincronización con Moodle',
    example: false,
  })
  sincronizado: boolean;

  @ApiProperty({
    description: 'Fecha de creación de la inscripción',
    example: '2024-12-03T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de eliminación lógica (Soft Delete)',
    example: null,
    nullable: true,
    required: false,
  })
  deletedAt?: Date;

  @ApiProperty({
    description: 'Nombre del grupo (opcional)',
    example: 'Grupo A',
    required: false,
  })
  grupoNombre?: string;

  @ApiProperty({
    description: 'Nombre del alumno (opcional)',
    example: 'Juan Pérez',
    required: false,
  })
  alumnoNombre?: string;

  @ApiProperty({
    description: 'Matrícula del alumno (opcional)',
    example: 'A20240001',
    required: false,
  })
  alumnoMatricula?: string;
}
