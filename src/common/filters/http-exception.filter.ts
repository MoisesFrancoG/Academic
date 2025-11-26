/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global que intercepta todas las excepciones HTTP
 * Estandariza el formato de respuesta de error para mantener consistencia en toda la API
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Obtener la respuesta de la excepción que puede ser string u objeto
    const exceptionResponse = exception.getResponse();

    // Extraer el mensaje y error manejando diferentes formatos de respuesta
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (exceptionResponse as any).message || 'Error en la petición';

    const error =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      typeof exceptionResponse === 'object' && (exceptionResponse as any).error
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (exceptionResponse as any).error
        : undefined;

    // Construir respuesta estandarizada de error
    const errorResponse = {
      statusCode: status,
      success: false,
      message: Array.isArray(message) ? message.join(', ') : message,
      ...(error && { error }), // Incluir campo error solo si existe
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(errorResponse);
  }
}
