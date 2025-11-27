import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para la entidad Alumno
 * Define la estructura de datos que se retorna al cliente
 */
export class AlumnoResponseDto {
  @ApiProperty({
    description: 'ID único del alumno (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre completo del alumno',
    example: 'Juan Pérez García',
  })
  nombre: string;

  @ApiProperty({
    description: 'Matrícula única del alumno',
    example: 'A20240001',
  })
  matricula: string;

  @ApiProperty({
    description: 'Cuatrimestre actual que está cursando',
    example: 3,
  })
  cuatrimestreActual: number;

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
