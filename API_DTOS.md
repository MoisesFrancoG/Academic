# 📋 API DTOs - Documentación Completa

## Tabla de Contenidos

- [¿Qué son los DTOs?](#qué-son-los-dtos)
- [Programa de Estudio](#programa-de-estudio)
- [Asignatura](#asignatura)
- [Docente](#docente)
- [Alumno](#alumno)
- [Grupo](#grupo)
- [Inscripción Grupo](#inscripción-grupo)
- [Validaciones Comunes](#validaciones-comunes)

---

## ¿Qué son los DTOs?

**DTO (Data Transfer Object)** es un patrón de diseño que define la estructura de datos que se transfiere entre el cliente y el servidor.

### Tipos de DTOs en esta API:

1. **Create DTOs**: Definen los campos requeridos para crear un nuevo recurso
2. **Update DTOs**: Definen los campos opcionales para actualizar un recurso existente
3. **Response DTOs**: Definen la estructura de datos que el servidor retorna al cliente

---

## Programa de Estudio

### CreateProgramaEstudioDto

**Uso:** `POST /programa-estudio`

```typescript
{
  nombre: string; // Requerido, 1-255 caracteres
  cantidadCuatrimestres: number; // Requerido, entero entre 1 y 20
}
```

**Ejemplo:**

```json
{
  "nombre": "Ingeniería en Sistemas Computacionales",
  "cantidadCuatrimestres": 9
}
```

**Validaciones:**

- ✅ `nombre`: Obligatorio, cadena de texto, máximo 255 caracteres
- ✅ `cantidadCuatrimestres`: Obligatorio, número entero entre 1 y 20

---

### UpdateProgramaEstudioDto

**Uso:** `PATCH /programa-estudio/:id`

```typescript
{
  nombre?: string;              // Opcional, 1-255 caracteres
  cantidadCuatrimestres?: number; // Opcional, entero entre 1 y 20
}
```

**Ejemplo:**

```json
{
  "nombre": "Ingeniería en Software"
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizan los campos enviados.

---

### ProgramaEstudioResponseDto

**Uso:** Respuesta de endpoints GET

```typescript
{
  id: number;
  nombre: string;
  cantidadCuatrimestres: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplo:**

```json
{
  "id": 1,
  "nombre": "Ingeniería en Sistemas Computacionales",
  "cantidadCuatrimestres": 9,
  "createdAt": "2024-12-01T10:00:00.000Z",
  "updatedAt": "2024-12-01T10:00:00.000Z"
}
```

---

## Asignatura

### CreateAsignaturaDto

**Uso:** `POST /asignatura`

```typescript
{
  nombre: string; // Requerido, 3-255 caracteres
  cuatrimestre: number; // Requerido, entero entre 1 y 12
  programaEstudioId: string; // Requerido, UUID válido
}
```

**Ejemplo:**

```json
{
  "nombre": "Matemáticas I",
  "cuatrimestre": 1,
  "programaEstudioId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Validaciones:**

- ✅ `nombre`: Obligatorio, 3-255 caracteres
- ✅ `cuatrimestre`: Obligatorio, número entero entre 1 y 12
- ✅ `programaEstudioId`: Obligatorio, UUID v4 válido (el programa debe existir)

---

### UpdateAsignaturaDto

**Uso:** `PATCH /asignatura/:id`

```typescript
{
  nombre?: string;
  cuatrimestre?: number;
  programaEstudioId?: string;
}
```

**Ejemplo:**

```json
{
  "nombre": "Matemáticas Avanzadas I"
}
```

**⚠️ Nota Importante:** Si cambias el `nombre`, se ejecuta la **Regla C (Cascada)**: todos los grupos de esta asignatura se marcarán como `sincronizado = false`.

---

### AsignaturaResponseDto

**Uso:** Respuesta de endpoints GET

```typescript
{
  id: string; // UUID
  nombre: string;
  cuatrimestre: number;
  programaEstudioId: string; // UUID
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplo:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Matemáticas I",
  "cuatrimestre": 1,
  "programaEstudioId": "660e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2024-12-01T10:00:00.000Z",
  "updatedAt": "2024-12-01T10:00:00.000Z"
}
```

---

## Docente

### CreateDocenteDto

**Uso:** `POST /docente`

```typescript
{
  nombre: string;                    // Requerido, 3-255 caracteres
  asignaturasCompetenciaIds?: string[]; // Opcional, array de UUIDs
}
```

**Ejemplo:**

```json
{
  "nombre": "Dr. Roberto Gómez",
  "asignaturasCompetenciaIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "660e8400-e29b-41d4-a716-446655440001"
  ]
}
```

**Validaciones:**

- ✅ `nombre`: Obligatorio, 3-255 caracteres
- ✅ `asignaturasCompetenciaIds`: Opcional, array de UUIDs v4 válidos (las asignaturas deben existir)

---

### UpdateDocenteDto

**Uso:** `PATCH /docente/:id`

```typescript
{
  nombre?: string;
  asignaturasCompetenciaIds?: string[];
}
```

**Ejemplo:**

```json
{
  "nombre": "Dr. Roberto Gómez Martínez"
}
```

**Nota:** Actualizar automáticamente marca `sincronizado = false`.

---

### DocenteResponseDto

**Uso:** Respuesta de endpoints GET

```typescript
{
  id: string; // UUID
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplo:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Dr. Roberto Gómez",
  "createdAt": "2024-12-01T10:00:00.000Z",
  "updatedAt": "2024-12-01T10:00:00.000Z"
}
```

**Nota:** Para obtener las asignaturas de competencia, el endpoint `GET /docente/:id` retorna un objeto expandido con la relación `asignaturasCompetencia`.

---

## Alumno

### CreateAlumnoDto

**Uso:** `POST /alumno`

```typescript
{
  nombre: string; // Requerido, 3-255 caracteres
  matricula: string; // Requerido, 5-50 caracteres, único
  cuatrimestreActual: number; // Requerido, entero >= 1
}
```

**Ejemplo:**

```json
{
  "nombre": "Juan Pérez García",
  "matricula": "A20240001",
  "cuatrimestreActual": 3
}
```

**Validaciones:**

- ✅ `nombre`: Obligatorio, 3-255 caracteres
- ✅ `matricula`: Obligatorio, 5-50 caracteres, **debe ser única**
- ✅ `cuatrimestreActual`: Obligatorio, número entero >= 1

---

### UpdateAlumnoDto

**Uso:** `PATCH /alumno/:id`

```typescript
{
  nombre?: string;
  matricula?: string;
  cuatrimestreActual?: number;
}
```

**Ejemplo:**

```json
{
  "nombre": "Juan Carlos Pérez García",
  "cuatrimestreActual": 4
}
```

**Validaciones especiales:**

- Si actualizas `matricula`, se verifica que no esté en uso por otro alumno
- Actualizar marca `sincronizado = false`

---

### AlumnoResponseDto

**Uso:** Respuesta de endpoints GET

```typescript
{
  id: string; // UUID
  nombre: string;
  matricula: string;
  cuatrimestreActual: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplo:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Juan Pérez García",
  "matricula": "A20240001",
  "cuatrimestreActual": 3,
  "createdAt": "2024-12-01T10:00:00.000Z",
  "updatedAt": "2024-12-01T10:00:00.000Z"
}
```

---

## Grupo

### CreateGrupoDto

**Uso:** `POST /grupo`

```typescript
{
  nombre: string;         // Requerido, 1-100 caracteres
  asignaturaId: string;   // Requerido, UUID válido
  docenteId: string;      // Requerido, UUID válido
  alumnoIds?: string[];   // Opcional, array de UUIDs
}
```

**Ejemplo:**

```json
{
  "nombre": "Grupo A",
  "asignaturaId": "550e8400-e29b-41d4-a716-446655440000",
  "docenteId": "660e8400-e29b-41d4-a716-446655440001",
  "alumnoIds": [
    "770e8400-e29b-41d4-a716-446655440002",
    "880e8400-e29b-41d4-a716-446655440003"
  ]
}
```

**Validaciones especiales:**

- ✅ `nombre`: Obligatorio, 1-100 caracteres
- ✅ `asignaturaId`: Debe existir en la base de datos
- ✅ `docenteId`: Debe existir y tener competencia en la asignatura
- ✅ `alumnoIds`: Opcional, todos los UUIDs deben existir

**Nota:** Los snapshots de `asignaturaNombreSnapshot` y `docenteNombreSnapshot` se crean automáticamente.

---

### UpdateGrupoDto

**Uso:** `PATCH /grupo/:id`

```typescript
{
  nombre?: string;
  asignaturaId?: string;
  docenteId?: string;
  alumnoIds?: string[];
}
```

**Ejemplo:**

```json
{
  "nombre": "Grupo A - Matutino",
  "docenteId": "nuevo-docente-uuid"
}
```

**Validaciones especiales:**

- Si cambias `docenteId` o `asignaturaId`, se valida la competencia del docente
- Actualizar marca `sincronizado = false`

---

### GrupoResponseDto

**Uso:** Respuesta de endpoints GET estándar

```typescript
{
  id: string; // UUID
  nombre: string;
  asignaturaNombreSnapshot: string;
  docenteNombreSnapshot: string;
  asignaturaId: string; // UUID
  docenteId: string; // UUID
  createdAt: Date;
  updatedAt: Date;
}
```

**Ejemplo:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Grupo A",
  "asignaturaNombreSnapshot": "Matemáticas I",
  "docenteNombreSnapshot": "Dr. Roberto Gómez",
  "asignaturaId": "660e8400-e29b-41d4-a716-446655440001",
  "docenteId": "770e8400-e29b-41d4-a716-446655440002",
  "createdAt": "2024-12-01T10:00:00.000Z",
  "updatedAt": "2024-12-01T10:00:00.000Z"
}
```

---

### GrupoSyncResponseDto (Endpoints /sync/\*)

**Uso:** `GET /grupo/sync/pending` y `GET /grupo/sync/deleted`

```typescript
{
  id: string;
  nombre: string;
  asignaturaNombreSnapshot: string;
  docenteNombreSnapshot: string;
  sincronizado: boolean;
  moodleCourseId: number | null;
  asignatura: {
    id: string;
    nombre: string;
    cuatrimestre: number;
    programaEstudio: {
      id: string;
      nombre: string;
      moodleCategoryId: number | null;
    }
  };
  docente: {
    id: string;
    nombre: string;
    moodleUserId: number | null;
  };
  deletedAt?: Date; // Solo en /sync/deleted
}
```

**Ejemplo:**

```json
{
  "id": "uuid-grupo",
  "nombre": "Grupo A",
  "asignaturaNombreSnapshot": "Matemáticas I",
  "docenteNombreSnapshot": "Dr. Roberto Gómez",
  "sincronizado": false,
  "moodleCourseId": null,
  "asignatura": {
    "id": "uuid-asignatura",
    "nombre": "Matemáticas I",
    "cuatrimestre": 1,
    "programaEstudio": {
      "id": "uuid-programa",
      "nombre": "Ingeniería en Sistemas",
      "moodleCategoryId": 10
    }
  },
  "docente": {
    "id": "uuid-docente",
    "nombre": "Dr. Roberto Gómez",
    "moodleUserId": 67
  }
}
```

**✅ Optimización:** Incluye `programaEstudio.moodleCategoryId` y `docente.moodleUserId` para evitar consultas adicionales.

---

## Inscripción Grupo

### CreateInscripcionGrupoDto

**Uso:** `POST /inscripciones-grupo`

```typescript
{
  grupoId: string; // Requerido, UUID válido
  alumnoId: string; // Requerido, UUID válido
}
```

**Ejemplo:**

```json
{
  "grupoId": "550e8400-e29b-41d4-a716-446655440000",
  "alumnoId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Validaciones:**

- ✅ `grupoId`: UUID v4 válido, el grupo debe existir
- ✅ `alumnoId`: UUID v4 válido, el alumno debe existir
- ✅ No debe existir una inscripción activa previa

---

### InscripcionGrupoResponseDto

**Uso:** Respuesta de endpoints GET estándar

```typescript
{
  id: string;
  grupoId: string;
  alumnoId: string;
  sincronizado: boolean;
  createdAt: Date;
  deletedAt?: Date;
  grupoNombre?: string;
  alumnoNombre?: string;
  alumnoMatricula?: string;
}
```

**Ejemplo:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "grupoId": "660e8400-e29b-41d4-a716-446655440001",
  "alumnoId": "770e8400-e29b-41d4-a716-446655440002",
  "sincronizado": false,
  "createdAt": "2024-12-01T10:00:00.000Z",
  "deletedAt": null,
  "grupoNombre": "Grupo A",
  "alumnoNombre": "Juan Pérez",
  "alumnoMatricula": "A20240001"
}
```

---

### InscripcionSyncResponseDto (Endpoints /sync/\*)

**Uso:** `GET /inscripciones-grupo/sync/pending` y `GET /inscripciones-grupo/sync/deleted`

```typescript
{
  id: string;
  grupoId: string;
  alumnoId: string;
  sincronizado: boolean;
  createdAt: Date;
  deletedAt?: Date;
  grupo: {
    id: string;
    nombre: string;
    moodleCourseId: number | null;
  };
  alumno: {
    id: string;
    nombre: string;
    matricula: string;
    moodleUserId: number | null;
  };
}
```

**Ejemplo:**

```json
{
  "id": "uuid-inscripcion",
  "grupoId": "uuid-grupo",
  "alumnoId": "uuid-alumno",
  "sincronizado": false,
  "createdAt": "2024-12-03T10:00:00Z",
  "deletedAt": null,
  "grupo": {
    "id": "uuid-grupo",
    "nombre": "Grupo A",
    "moodleCourseId": 123
  },
  "alumno": {
    "id": "uuid-alumno",
    "nombre": "Juan Pérez",
    "matricula": "A20240001",
    "moodleUserId": 45
  }
}
```

**✅ Optimización:** Incluye `grupo.moodleCourseId` y `alumno.moodleUserId` listos para usar en Moodle.

---

## Validaciones Comunes

### Validadores de Class-Validator

Todos los DTOs utilizan decoradores de `class-validator` para validación automática:

| Decorador       | Propósito             | Ejemplo                |
| --------------- | --------------------- | ---------------------- |
| `@IsString()`   | Valida que sea texto  | `nombre: string`       |
| `@IsInt()`      | Valida que sea entero | `cuatrimestre: number` |
| `@IsNotEmpty()` | No puede estar vacío  | Campos obligatorios    |
| `@IsOptional()` | Campo opcional        | Update DTOs            |
| `@IsUUID('4')`  | Valida UUID v4        | `asignaturaId: string` |
| `@IsArray()`    | Valida array          | `alumnoIds: string[]`  |
| `@MinLength(n)` | Longitud mínima       | `@MinLength(3)`        |
| `@MaxLength(n)` | Longitud máxima       | `@MaxLength(255)`      |
| `@Min(n)`       | Valor mínimo          | `@Min(1)`              |
| `@Max(n)`       | Valor máximo          | `@Max(20)`             |

### Ejemplo de Respuesta de Error de Validación

Cuando un DTO no cumple las validaciones, la API retorna `400 Bad Request`:

```json
{
  "statusCode": 400,
  "message": [
    "El nombre debe tener al menos 3 caracteres",
    "El ID de la asignatura debe ser un UUID válido"
  ],
  "error": "Bad Request"
}
```

---

## Campos de Sincronización (Solo en Respuestas)

Los siguientes campos son **solo de lectura** y se gestionan automáticamente por el backend:

| Campo              | Tipo             | Descripción                                   |
| ------------------ | ---------------- | --------------------------------------------- |
| `sincronizado`     | `boolean`        | `false` = pendiente de sincronizar con Moodle |
| `moodleUserId`     | `number \| null` | ID del usuario en Moodle (Alumno/Docente)     |
| `moodleCourseId`   | `number \| null` | ID del curso en Moodle (Grupo)                |
| `moodleCategoryId` | `number \| null` | ID de categoría en Moodle (ProgramaEstudio)   |
| `deletedAt`        | `Date \| null`   | Fecha de soft delete                          |

**⚠️ Importante:** Estos campos NO se incluyen en Create/Update DTOs. Se establecen mediante:

- Endpoints `POST /:id/sync` (para moodleId)
- Lógica interna del backend (sincronizado, deletedAt)

---

## DTOs Especiales para Sincronización

### ConfirmSyncDto (Alumno/Docente)

**Uso:** `POST /alumno/:id/sync` y `POST /docente/:id/sync`

```typescript
{
  moodleUserId: number; // Requerido, ID del usuario en Moodle
}
```

**Ejemplo:**

```json
{
  "moodleUserId": 45
}
```

---

### ConfirmSyncDto (Grupo)

**Uso:** `POST /grupo/:id/sync`

```typescript
{
  moodleCourseId: number; // Requerido, ID del curso en Moodle
}
```

**Ejemplo:**

```json
{
  "moodleCourseId": 123
}
```

---

### ConfirmSyncDto (ProgramaEstudio)

**Uso:** `POST /programa-estudio/:id/sync`

```typescript
{
  moodleCategoryId: number; // Requerido, ID de categoría en Moodle
}
```

**Ejemplo:**

```json
{
  "moodleCategoryId": 10
}
```

---

### ConfirmSyncDto (InscripcionGrupo)

**Uso:** `POST /inscripciones-grupo/:id/sync`

**Request Body:** Vacío o sin body

**Descripción:** Solo marca `sincronizado = true`. No requiere moodleId porque la inscripción se identifica por `grupo.moodleCourseId` y `alumno.moodleUserId`.

---

## Resumen de DTOs por Endpoint

### POST (Create)

- `/programa-estudio` → `CreateProgramaEstudioDto`
- `/asignatura` → `CreateAsignaturaDto`
- `/docente` → `CreateDocenteDto`
- `/alumno` → `CreateAlumnoDto`
- `/grupo` → `CreateGrupoDto`
- `/inscripciones-grupo` → `CreateInscripcionGrupoDto`

### PATCH (Update)

- `/programa-estudio/:id` → `UpdateProgramaEstudioDto`
- `/asignatura/:id` → `UpdateAsignaturaDto`
- `/docente/:id` → `UpdateDocenteDto`
- `/alumno/:id` → `UpdateAlumnoDto`
- `/grupo/:id` → `UpdateGrupoDto`

### GET (Response)

- Endpoints CRUD estándar → `*ResponseDto`
- Endpoints `/sync/*` → Objetos expandidos con relaciones pobladas

### POST /:id/sync (Confirm)

- Cada entidad tiene su propio DTO de confirmación con el campo `moodleId` correspondiente

---

**Documentación API:** Consulta `API_ENDPOINTS.md` para detalles completos de cada endpoint.  
**Fecha:** 3 de diciembre de 2025  
**Versión:** 0.2A - Entities Branch
