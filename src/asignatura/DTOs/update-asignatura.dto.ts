import { PartialType } from '@nestjs/swagger';
import { CreateAsignaturaDto } from './create-asignatura.dto';

/**
 * DTO para actualizar una asignatura existente
 * Todos los campos son opcionales (heredados de CreateAsignaturaDto)
 */
export class UpdateAsignaturaDto extends PartialType(CreateAsignaturaDto) {}
