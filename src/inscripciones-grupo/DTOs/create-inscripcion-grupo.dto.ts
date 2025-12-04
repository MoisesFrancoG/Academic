import { IsUUID, IsNotEmpty } from 'class-validator';

/**
 * DTO para crear una nueva inscripción de alumno a grupo
 */
export class CreateInscripcionGrupoDto {
  @IsUUID('4', { message: 'El ID del grupo debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del grupo es obligatorio' })
  grupoId: string;

  @IsUUID('4', { message: 'El ID del alumno debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del alumno es obligatorio' })
  alumnoId: string;
}
