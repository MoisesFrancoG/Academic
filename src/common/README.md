# Common - Componentes Compartidos

Este directorio contiene componentes fundamentales que estandarizan el manejo de respuestas y errores en toda la API.

## Estructura

```
common/
├── dto/
│   └── api-response.dto.ts      # DTO genérico para respuestas estandarizadas
├── filters/
│   └── http-exception.filter.ts # Filtro para manejo centralizado de excepciones
├── interceptors/
│   └── transform.interceptor.ts # Interceptor para transformar respuestas
└── index.ts                      # Archivo barrel para exportaciones
```

## Componentes

### 1. ApiResponse DTO (`api-response.dto.ts`)

**Propósito:** Define una plantilla genérica para todas las respuestas de la API, garantizando estructura consistente.

**Propiedades:**

- `statusCode` (number): Código de estado HTTP
- `success` (boolean): Indica si la operación fue exitosa
- `message` (string, opcional): Mensaje descriptivo del resultado
- `data` (genérico T, opcional): Datos de la respuesta
- `timestamp` (string): Fecha/hora ISO cuando se generó la respuesta

**Ejemplo de respuesta:**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Ingeniería de Software"
  },
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

### 2. HttpExceptionFilter (`http-exception.filter.ts`)

**Propósito:** Intercepta todas las excepciones HTTP y las transforma al formato estandarizado.

**Características:**

- Captura automáticamente todas las `HttpException`
- Extrae información relevante (statusCode, mensaje, error)
- Maneja diferentes formatos de respuesta de excepción (string u objeto)
- Incluye path de la petición para debugging
- Agrega timestamp automático

**Ejemplo de respuesta de error:**

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Recurso no encontrado",
  "error": "Not Found",
  "timestamp": "2025-11-26T10:30:00.000Z",
  "path": "/api/programa-estudio/999"
}
```

### 3. TransformInterceptor (`transform.interceptor.ts`)

**Propósito:** Transforma automáticamente todas las respuestas exitosas al formato `ApiResponse`.

**Funcionamiento:**

1. Intercepta la respuesta antes de enviarla al cliente
2. Envuelve los datos en el DTO `ApiResponse`
3. Agrega metadatos (statusCode, success, timestamp)
4. El controller solo retorna los datos, el interceptor hace el resto

**Antes (controller retorna):**

```typescript
return { id: 1, nombre: 'Ingeniería' };
```

**Después (cliente recibe):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Ingeniería"
  },
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

## Flujo de Trabajo

### Operación Exitosa

```
Request → Controller → TransformInterceptor → Response Estandarizada
```

### Operación con Error

```
Request → Controller → HttpException → HttpExceptionFilter → Error Estandarizado
```

## Configuración

Los componentes están registrados globalmente en `main.ts`:

```typescript
// Filtro de excepciones
app.useGlobalFilters(new HttpExceptionFilter());

// Interceptor de transformación
app.useGlobalInterceptors(new TransformInterceptor());
```

## Uso en Controllers

Los controllers no necesitan preocuparse por formatear respuestas:

```typescript
@Controller('programa-estudio')
export class ProgramaEstudioController {
  @Get(':id')
  async findOne(@Param('id') id: number) {
    // Solo retornar datos o lanzar excepciones
    const programa = await this.service.findOne(id);

    if (!programa) {
      throw new NotFoundException('Programa de estudio no encontrado');
    }

    return programa; // El interceptor lo envuelve automáticamente
  }
}
```

## Beneficios

✅ **Consistencia Total:** Todas las respuestas siguen el mismo formato JSON

✅ **Separación de Responsabilidades:** Los controllers solo manejan lógica de negocio

✅ **Mantenibilidad:** Cambios al formato de respuesta se hacen en un solo lugar

✅ **Documentación Automática:** Swagger documenta la estructura automáticamente

✅ **Debugging Facilitado:** Cada respuesta incluye timestamp y path

✅ **Type Safety:** Uso de genéricos mantiene seguridad de tipos en TypeScript

## Integración con Swagger

Todos los DTOs están decorados con `@ApiProperty`, lo que permite:

- Documentación automática en Swagger UI
- Ejemplos de respuesta en la documentación
- Validación de esquemas
- Generación de clientes tipados

Accede a la documentación en: `http://localhost:3000/api/docs`

## Mejores Prácticas

1. **Nunca retornar `ApiResponse` manualmente** desde un controller - el interceptor lo hace automáticamente
2. **Usar excepciones estándar de NestJS** (`NotFoundException`, `BadRequestException`, etc.)
3. **Mensajes descriptivos** en las excepciones para mejor debugging
4. **DTOs específicos** para los datos de respuesta, solo la envoltura es genérica
5. **Documentar endpoints** con decoradores de Swagger para mejor developer experience

## Extensibilidad

Para agregar campos adicionales a las respuestas:

1. Modificar `ApiResponse` DTO
2. Actualizar `TransformInterceptor` para incluir nuevos campos
3. Actualizar `HttpExceptionFilter` si aplica para errores

Ejemplo: Agregar ID de petición para trazabilidad:

```typescript
export class ApiResponse<T> {
  // ... campos existentes

  @ApiProperty({ description: 'ID único de la petición' })
  requestId?: string;
}
```
