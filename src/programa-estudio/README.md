# Módulo Programa de Estudio

Módulo completo para la gestión de Programas de Estudio con integración TypeORM, validaciones, y respuestas estandarizadas.

## Estructura del Módulo

```
programa-estudio/
├── controller/
│   ├── programa-estudio.controller.ts   # Controlador REST con endpoints CRUD
│   └── controller.module.ts             # Módulo del controlador
├── DTOs/
│   ├── create-programa-estudio.dto.ts   # DTO para creación con validaciones
│   ├── update-programa-estudio.dto.ts   # DTO para actualización con validaciones
│   ├── programa-estudio-response.dto.ts # DTO de respuesta para Swagger
│   └── index.ts                          # Exports
├── entities/
│   └── programa-estudio.entity.ts       # Entidad TypeORM
├── repository/
│   ├── programa-estudio.providers.ts    # Providers del repositorio
│   └── repository.module.ts             # Módulo del repositorio
├── service/
│   ├── programa-estudio.service.ts      # Servicio con lógica de negocio
│   └── service.module.ts                # Módulo del servicio
├── programa-estudio.module.ts           # Módulo principal
└── README.md                             # Esta documentación
```

## Modelo de Datos

### Entidad: ProgramaEstudio

| Campo                   | Tipo   | Descripción               | Validaciones                          |
| ----------------------- | ------ | ------------------------- | ------------------------------------- |
| `id`                    | number | ID autoincremental (PK)   | Generado automáticamente por la BD    |
| `nombre`                | string | Nombre del programa       | Requerido, máx. 255 caracteres, único |
| `cantidadCuatrimestres` | number | Duración en cuatrimestres | Requerido, entero, min: 1, max: 20    |
| `createdAt`             | Date   | Fecha de creación         | Generado automáticamente              |
| `updatedAt`             | Date   | Fecha de actualización    | Actualizado automáticamente           |

### Tabla en Base de Datos

```sql
CREATE TABLE programa_estudio (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  cantidad_cuatrimestres INT NOT NULL CHECK (cantidad_cuatrimestres >= 1 AND cantidad_cuatrimestres <= 20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## API Endpoints

### 1. Crear Programa de Estudio

**POST** `/programa-estudio`

**Request Body:**

```json
{
  "nombre": "Ingeniería en Software",
  "cantidadCuatrimestres": 10
}
```

**Response:** `201 Created`

```json
{
  "statusCode": 201,
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Ingeniería en Software",
    "cantidadCuatrimestres": 10,
    "createdAt": "2025-11-26T10:30:00.000Z",
    "updatedAt": "2025-11-26T10:30:00.000Z"
  },
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

**Errores Posibles:**

- `400 Bad Request`: Datos inválidos
- `409 Conflict`: El nombre ya existe

---

### 2. Obtener Todos los Programas

**GET** `/programa-estudio`

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Ingeniería en Software",
      "cantidadCuatrimestres": 10,
      "createdAt": "2025-11-26T10:30:00.000Z",
      "updatedAt": "2025-11-26T10:30:00.000Z"
    }
  ],
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

---

### 3. Obtener Programa por ID

**GET** `/programa-estudio/:id`

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Ingeniería en Software",
    "cantidadCuatrimestres": 10,
    "createdAt": "2025-11-26T10:30:00.000Z",
    "updatedAt": "2025-11-26T10:30:00.000Z"
  },
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

**Errores Posibles:**

- `404 Not Found`: Programa no encontrado

---

### 4. Contar Programas

**GET** `/programa-estudio/count`

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "count": 5
  },
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

---

### 5. Actualizar Programa

**PATCH** `/programa-estudio/:id`

**Request Body:** (todos los campos son opcionales)

```json
{
  "nombre": "Ingeniería en Tecnologías de la Información",
  "cantidadCuatrimestres": 12
}
```

**Response:** `200 OK`

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Ingeniería en Tecnologías de la Información",
    "cantidadCuatrimestres": 12,
    "createdAt": "2025-11-26T10:30:00.000Z",
    "updatedAt": "2025-11-26T11:00:00.000Z"
  },
  "timestamp": "2025-11-26T11:00:00.000Z"
}
```

**Errores Posibles:**

- `404 Not Found`: Programa no encontrado
- `409 Conflict`: El nuevo nombre ya existe

---

### 6. Eliminar Programa

**DELETE** `/programa-estudio/:id`

**Response:** `204 No Content`

**Errores Posibles:**

- `404 Not Found`: Programa no encontrado

---

## Validaciones

### CreateProgramaEstudioDto

```typescript
{
  nombre: string; // Requerido, string, max 255 caracteres
  cantidadCuatrimestres: number; // Requerido, entero, min 1, max 20
}
```

**Mensajes de Error:**

- `nombre`:
  - "El nombre debe ser una cadena de texto"
  - "El nombre es obligatorio"
  - "El nombre no puede exceder los 255 caracteres"
- `cantidadCuatrimestres`:
  - "La cantidad de cuatrimestres debe ser un número entero"
  - "La cantidad de cuatrimestres debe ser al menos 1"
  - "La cantidad de cuatrimestres no puede exceder 20"

### UpdateProgramaEstudioDto

Extiende de `CreateProgramaEstudioDto` usando `PartialType`, todos los campos son opcionales.

## Lógica de Negocio

### Servicio: ProgramaEstudioService

#### Características:

1. **Validación de Unicidad**: El nombre del programa debe ser único
2. **Manejo de Errores**: Todos los errores se transforman en excepciones HTTP apropiadas
3. **Ordenamiento**: Los programas se retornan ordenados por fecha de creación (descendente)
4. **Transacciones Implícitas**: TypeORM maneja transacciones automáticamente

#### Métodos:

- `create(createDto)`: Crea nuevo programa verificando unicidad de nombre
- `findAll()`: Retorna todos los programas ordenados
- `findOne(id)`: Busca programa por ID
- `update(id, updateDto)`: Actualiza programa verificando unicidad de nuevo nombre
- `remove(id)`: Elimina programa
- `count()`: Cuenta total de programas

## Integración TypeORM

### Configuración

La entidad está configurada en `database.providers.ts` para autodetección:

```typescript
entities: [__dirname + '/../**/*.entity{.ts,.js}'];
```

### Autoincrement

El ID usa la estrategia `increment` de PostgreSQL:

```typescript
@PrimaryGeneratedColumn('increment')
id: number;
```

### Timestamps Automáticos

```typescript
@CreateDateColumn()  // Se establece al crear
createdAt: Date;

@UpdateDateColumn()  // Se actualiza automáticamente
updatedAt: Date;
```

## Documentación Swagger

Todos los endpoints están completamente documentados con Swagger:

- **Decoradores en Controller**: `@ApiOperation`, `@ApiResponse`, `@ApiParam`, `@ApiBody`
- **Decoradores en DTOs**: `@ApiProperty` con ejemplos y descripciones
- **Tipos de Respuesta**: Documentados con `ProgramaEstudioResponseDto`

Acceder a la documentación: `http://localhost:3000/api/docs`

## Ejemplo de Uso

### 1. Configurar Base de Datos

Crea un archivo `.env` basado en `.env.example`:

```env
PORT=3000
TYPE=postgres
HOST=localhost
DB_PORT=5432
USERNAME=postgres
PASSWORD=your_password
DATABASE=academic_db
```

### 2. Iniciar Aplicación

```bash
pnpm install
pnpm run start:dev
```

### 3. Probar Endpoints

**Crear programa:**

```bash
curl -X POST http://localhost:3000/programa-estudio \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ingeniería en Software",
    "cantidadCuatrimestres": 10
  }'
```

**Listar programas:**

```bash
curl http://localhost:3000/programa-estudio
```

**Obtener por ID:**

```bash
curl http://localhost:3000/programa-estudio/1
```

**Actualizar:**

```bash
curl -X PATCH http://localhost:3000/programa-estudio/1 \
  -H "Content-Type: application/json" \
  -d '{"cantidadCuatrimestres": 12}'
```

**Eliminar:**

```bash
curl -X DELETE http://localhost:3000/programa-estudio/1
```

## Respuestas Estandarizadas

Todas las respuestas siguen el formato definido en `common/dto/api-response.dto.ts`:

### Respuesta Exitosa

```json
{
  "statusCode": 200,
  "success": true,
  "data": { ... },
  "timestamp": "2025-11-26T10:30:00.000Z"
}
```

### Respuesta de Error

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Programa de estudio con ID 999 no encontrado",
  "timestamp": "2025-11-26T10:30:00.000Z",
  "path": "/programa-estudio/999"
}
```

## Testing

### Ejemplos de Casos de Prueba

```typescript
describe('ProgramaEstudioController', () => {
  it('debe crear un programa de estudio', async () => {
    const dto = { nombre: 'Test', cantidadCuatrimestres: 10 };
    const result = await controller.create(dto);
    expect(result.nombre).toBe('Test');
  });

  it('debe lanzar ConflictException si el nombre existe', async () => {
    await expect(service.create(dtoExistente)).rejects.toThrow(
      ConflictException,
    );
  });
});
```

## Mejores Prácticas Implementadas

✅ **Separación de Responsabilidades**: Controller → Service → Repository

✅ **Validación en Múltiples Capas**: DTOs, Servicio, Base de Datos

✅ **Manejo de Errores Centralizado**: Filtro de excepciones HTTP

✅ **Respuestas Estandarizadas**: Interceptor de transformación

✅ **Documentación Completa**: Swagger integrado

✅ **Type Safety**: TypeScript en toda la aplicación

✅ **Código Limpio**: Comentarios, nombres descriptivos

✅ **Configuración Externa**: Variables de entorno

## Extensibilidad

Para agregar nuevas funcionalidades:

1. **Nuevos campos**: Modificar entidad y DTOs
2. **Nuevas validaciones**: Agregar decoradores en DTOs
3. **Nueva lógica**: Implementar en servicio
4. **Nuevos endpoints**: Agregar en controller

## Troubleshooting

### Error: "Cannot find module '@nestjs/swagger'"

```bash
pnpm add @nestjs/swagger
```

### Error: "Cannot connect to database"

Verificar configuración en `.env` y que PostgreSQL esté corriendo.

### Error: "Entity not found"

Asegurarse que el pattern de entidades en `database.providers.ts` es correcto.

### Tabla no se crea

Verificar que `synchronize: true` esté en `database.providers.ts` (solo desarrollo).

## Recursos Adicionales

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Class Validator](https://github.com/typestack/class-validator)
- [Swagger/OpenAPI](https://swagger.io/specification/)
