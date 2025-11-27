import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para la entidad Docente
 * Define la estructura de datos que se retorna al cliente
 */
export class DocenteResponseDto {
  @ApiProperty({
    description: 'ID único del docente (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre completo del docente',
    example: 'Dr. Carlos Martínez López',
  })
  nombre: string;

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
