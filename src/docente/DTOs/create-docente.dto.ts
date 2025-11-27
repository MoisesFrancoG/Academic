import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsArray, IsUUID, IsOptional } from 'class-validator';

/**
 * DTO para crear un nuevo docente
 */
export class CreateDocenteDto {
  @ApiProperty({
    description: 'Nombre completo del docente',
    example: 'Dr. Carlos Martínez López',
    minLength: 3,
    maxLength: 255,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Lista de UUIDs de asignaturas en las que el docente tiene competencia para impartir',
    example: ['550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Las competencias deben ser un arreglo' })
  @IsUUID('4', { each: true, message: 'Cada competencia debe ser un UUID válido' })
  asignaturasCompetenciaIds?: string[];
}
