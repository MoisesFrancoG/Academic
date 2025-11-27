import { PartialType } from '@nestjs/swagger';
import { CreateDocenteDto } from './create-docente.dto';

/**
 * DTO para actualizar un docente existente
 * Todos los campos son opcionales (heredados de CreateDocenteDto)
 */
export class UpdateDocenteDto extends PartialType(CreateDocenteDto) {}
