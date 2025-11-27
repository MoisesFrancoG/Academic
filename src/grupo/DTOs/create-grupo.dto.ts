import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID, IsArray, IsOptional } from 'class-validator';

/**
 * DTO para crear un nuevo grupo
 */
export class CreateGrupoDto {
  @ApiProperty({
    description: 'Nombre del grupo',
    example: '9A',
    minLength: 1,
    maxLength: 100,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(1, { message: 'El nombre debe tener al menos 1 caracter' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'UUID de la asignatura que se imparte en este grupo',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString({ message: 'El ID de la asignatura debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID de la asignatura es obligatorio' })
  @IsUUID('4', { message: 'El ID de la asignatura debe ser un UUID válido' })
  asignaturaId: string;

  @ApiProperty({
    description: 'UUID del docente asignado al grupo',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsString({ message: 'El ID del docente debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El ID del docente es obligatorio' })
  @IsUUID('4', { message: 'El ID del docente debe ser un UUID válido' })
  docenteId: string;

  @ApiProperty({
    description: 'Lista de UUIDs de alumnos inscritos en el grupo',
    example: ['770e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Los alumnos deben ser un arreglo' })
  @IsUUID('4', { each: true, message: 'Cada alumno debe ser un UUID válido' })
  alumnoIds?: string[];
}
