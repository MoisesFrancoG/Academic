import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para la entidad Asignatura
 * Define la estructura de datos que se retorna al cliente
 */
export class AsignaturaResponseDto {
  @ApiProperty({
    description: 'ID único de la asignatura (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la asignatura',
    example: 'Programación Orientada a Objetos',
  })
  nombre: string;

  @ApiProperty({
    description: 'Cuatrimestre en el que se imparte',
    example: 3,
  })
  cuatrimestre: number;

  @ApiProperty({
    description: 'UUID del programa de estudio al que pertenece',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  programaEstudioId: string;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
