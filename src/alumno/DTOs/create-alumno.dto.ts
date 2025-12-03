import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';

/**
 * DTO para crear un nuevo alumno
 */
export class CreateAlumnoDto {
  @ApiProperty({
    description: 'Nombre completo del alumno',
    example: 'Juan Pérez García',
    minLength: 3,
    maxLength: 255,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Matrícula única del alumno',
    example: 'A20240001',
    minLength: 5,
    maxLength: 50,
  })
  @IsString({ message: 'La matrícula debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La matrícula es obligatoria' })
  @MinLength(5, { message: 'La matrícula debe tener al menos 5 caracteres' })
  @MaxLength(50, { message: 'La matrícula no puede exceder 50 caracteres' })
  matricula: string;

  @ApiProperty({
    description: 'Cuatrimestre actual que está cursando el alumno',
    example: 3,
    minimum: 1,
  })
  @IsInt({ message: 'El cuatrimestre actual debe ser un número entero' })
  @IsNotEmpty({ message: 'El cuatrimestre actual es obligatorio' })
  @Min(1, { message: 'El cuatrimestre actual debe ser al menos 1' })
  cuatrimestreActual: number;
}
