import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsInt, Min, Max, IsUUID } from 'class-validator';

/**
 * DTO para crear una nueva asignatura
 */
export class CreateAsignaturaDto {
  @ApiProperty({
    description: 'Nombre de la asignatura',
    example: 'Programación Orientada a Objetos',
    minLength: 3,
    maxLength: 255,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Cuatrimestre en el que se imparte la asignatura',
    example: 3,
    minimum: 1,
    maximum: 12,
  })
  @IsInt({ message: 'El cuatrimestre debe ser un número entero' })
  @IsNotEmpty({ message: 'El cuatrimestre es obligatorio' })
  @Min(1, { message: 'El cuatrimestre debe ser al menos 1' })
  @Max(12, { message: 'El cuatrimestre no puede ser mayor a 12' })
  cuatrimestre: number;

  @ApiProperty({
    description: 'UUID del programa de estudio al que pertenece la asignatura',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString({ message: 'El ID del programa de estudio debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID del programa de estudio es obligatorio' })
  @IsUUID('4', { message: 'El ID del programa de estudio debe ser un UUID válido' })
  programaEstudioId: string;
}
