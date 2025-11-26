import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

/**
 * DTO para crear un nuevo Programa de Estudio
 */
export class CreateProgramaEstudioDto {
  @ApiProperty({
    description: 'Nombre del programa de estudio',
    example: 'Ingeniería en Software',
    maxLength: 255,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Cantidad de cuatrimestres que dura el programa',
    example: 10,
    minimum: 1,
    maximum: 20,
  })
  @IsInt({ message: 'La cantidad de cuatrimestres debe ser un número entero' })
  @Min(1, { message: 'La cantidad de cuatrimestres debe ser al menos 1' })
  @Max(20, { message: 'La cantidad de cuatrimestres no puede exceder 20' })
  cantidadCuatrimestres: number;
}
