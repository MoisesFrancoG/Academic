import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO genérico para estandarizar todas las respuestas de la API
 * Garantiza consistencia en la estructura de respuesta para operaciones exitosas y con errores
 */
export class ApiResponse<T> {
  @ApiProperty({
    description: 'Código de estado HTTP de la respuesta',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo sobre el resultado de la operación',
    example: 'Operación completada exitosamente',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'Datos de la respuesta',
    required: false,
  })
  data?: T;

  @ApiProperty({
    description:
      'Timestamp en formato ISO 8601 de cuando se generó la respuesta',
    example: '2025-11-26T10:30:00.000Z',
  })
  timestamp: string;
}
