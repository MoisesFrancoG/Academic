import { PartialType } from '@nestjs/swagger';
import { CreateGrupoDto } from './create-grupo.dto';

/**
 * DTO para actualizar un grupo existente
 * Todos los campos son opcionales (heredados de CreateGrupoDto)
 */
export class UpdateGrupoDto extends PartialType(CreateGrupoDto) {}
