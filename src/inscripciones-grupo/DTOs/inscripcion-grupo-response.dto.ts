/**
 * DTO de respuesta para inscripciones de grupo
 * Incluye información completa de la inscripción
 */
export class InscripcionGrupoResponseDto {
  id: string;
  grupoId: string;
  alumnoId: string;
  sincronizado: boolean;
  createdAt: Date;
  deletedAt?: Date;

  // Información adicional opcional
  grupoNombre?: string;
  alumnoNombre?: string;
  alumnoMatricula?: string;
}
