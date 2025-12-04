import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para crear una nueva inscripción de alumno a grupo
 */
export class CreateInscripcionGrupoDto {
  @ApiProperty({
    description: 'UUID del grupo al que se inscribe el alumno',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'El ID del grupo debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del grupo es obligatorio' })
  grupoId: string;

  @ApiProperty({
    description: 'UUID del alumno a inscribir',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID('4', { message: 'El ID del alumno debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del alumno es obligatorio' })
  alumnoId: string;
}
