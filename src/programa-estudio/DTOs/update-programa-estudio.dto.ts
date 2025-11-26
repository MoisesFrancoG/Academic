import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProgramaEstudioDto } from './create-programa-estudio.dto';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

/**
 * DTO para actualizar un Programa de Estudio existente
 * Todos los campos son opcionales (heredado de PartialType)
 */
export class UpdateProgramaEstudioDto extends PartialType(
  CreateProgramaEstudioDto,
) {
  @ApiProperty({
    description: 'Nombre del programa de estudio',
    example: 'Ingeniería en Software',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres' })
  nombre?: string;

  @ApiProperty({
    description: 'Cantidad de cuatrimestres que dura el programa',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 20,
  })
  @IsOptional()
  @IsInt({ message: 'La cantidad de cuatrimestres debe ser un número entero' })
  @Min(1, { message: 'La cantidad de cuatrimestres debe ser al menos 1' })
  @Max(20, { message: 'La cantidad de cuatrimestres no puede exceder 20' })
  cantidadCuatrimestres?: number;
}
