import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dto/api-response.dto';

/**
 * Interceptor global que transforma automáticamente todas las respuestas exitosas
 * al formato ApiResponse estandarizado
 *
 * Intercepta la respuesta antes de que llegue al cliente y la envuelve en el DTO ApiResponse
 * agregando metadatos como statusCode, success, y timestamp
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        statusCode: response.statusCode,
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
