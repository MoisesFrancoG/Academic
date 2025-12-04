import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para la entidad Grupo
 * Define la estructura de datos que se retorna al cliente
 */
export class GrupoResponseDto {
  @ApiProperty({
    description: 'ID único del grupo (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del grupo',
    example: '9A',
  })
  nombre: string;

  @ApiProperty({
    description: 'Snapshot del nombre de la asignatura',
    example: 'Programación Orientada a Objetos',
  })
  asignaturaNombreSnapshot: string;

  @ApiProperty({
    description: 'Snapshot del nombre del docente',
    example: 'Dr. Carlos Martínez López',
  })
  docenteNombreSnapshot: string;

  @ApiProperty({
    description: 'UUID de la asignatura (puede ser null si fue eliminada)',
    example: '660e8400-e29b-41d4-a716-446655440001',
    nullable: true,
  })
  asignaturaId: string | null;

  @ApiProperty({
    description: 'UUID del docente (puede ser null si fue eliminado)',
    example: '770e8400-e29b-41d4-a716-446655440002',
    nullable: true,
  })
  docenteId: string | null;

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
