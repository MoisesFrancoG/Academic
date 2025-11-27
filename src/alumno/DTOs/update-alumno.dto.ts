import { PartialType } from '@nestjs/swagger';
import { CreateAlumnoDto } from './create-alumno.dto';

/**
 * DTO para actualizar un alumno existente
 * Todos los campos son opcionales (heredados de CreateAlumnoDto)
 */
export class UpdateAlumnoDto extends PartialType(CreateAlumnoDto) {}
