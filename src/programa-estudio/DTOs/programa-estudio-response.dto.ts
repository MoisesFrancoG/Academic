import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para Programa de Estudio
 * Representa la estructura de datos que se envía al cliente
 */
export class ProgramaEstudioResponseDto {
  @ApiProperty({
    description: 'ID único del programa de estudio',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del programa de estudio',
    example: 'Ingeniería en Software',
  })
  nombre: string;

  @ApiProperty({
    description: 'Cantidad de cuatrimestres que dura el programa',
    example: 10,
  })
  cantidadCuatrimestres: number;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2025-11-26T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2025-11-26T10:30:00.000Z',
  })
  updatedAt: Date;
}
