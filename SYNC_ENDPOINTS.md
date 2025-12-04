# Endpoints de Sincronización con Moodle

## Resumen

Se han implementado endpoints de confirmación de sincronización para que el **Orquestador** (sistema Java) notifique a la API de NestJS cuando un recurso ha sido sincronizado exitosamente en Moodle.

## Arquitectura

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────┐
│  NestJS API     │──────▶│   Orquestador    │──────▶│   Moodle    │
│  (Academic)     │       │     (Java)       │       │             │
└─────────────────┘       └──────────────────┘       └─────────────┘
         ▲                         │
         │                         │
         └─────────────────────────┘
              POST /:id/sync
           (Confirmación exitosa)
```

### Flujo de Sincronización

1. **NestJS API** crea/actualiza un recurso → `sincronizado = false`
2. **Orquestador** consulta recursos pendientes (`sincronizado = false`)
3. **Orquestador** sincroniza con **Moodle**
4. **Orquestador** confirma a **NestJS** → `POST /:id/sync` con `moodleId`
5. **NestJS API** marca → `sincronizado = true` y almacena `moodleId`

---

## Endpoints Implementados

### 1. Alumno

**Endpoint:** `POST /alumno/:id/sync`

**Descripción:** Confirma que el alumno fue sincronizado exitosamente en Moodle como usuario.

**Request Body:**

```json
{
  "moodleUserId": 45
}
```

**Response:** `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nombre": "Juan Pérez",
  "matricula": "A20240001",
  "cuatrimestre": 3,
  "moodleUserId": 45,
  "sincronizado": true,
  "deletedAt": null,
  "createdAt": "2024-12-01T10:00:00.000Z",
  "updatedAt": "2024-12-03T15:30:00.000Z"
}
```

**Errores:**

- `404 Not Found` - Alumno no encontrado

**Implementación:**

- Service: `AlumnoService.confirmMoodleSync(id, moodleUserId)`
- Actualiza campos: `moodleUserId`, `sincronizado = true`

---

### 2. Docente

**Endpoint:** `POST /docente/:id/sync`

**Descripción:** Confirma que el docente fue sincronizado exitosamente en Moodle como usuario.

**Request Body:**

```json
{
  "moodleUserId": 67
}
```

**Response:** `200 OK`

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "nombre": "Dr. Roberto Gómez",
  "moodleUserId": 67,
  "sincronizado": true,
  "deletedAt": null,
  "asignaturasCompetencia": [...],
  "createdAt": "2024-12-01T10:00:00.000Z",
  "updatedAt": "2024-12-03T15:35:00.000Z"
}
```

**Errores:**

- `404 Not Found` - Docente no encontrado

**Implementación:**

- Service: `DocenteService.confirmMoodleSync(id, moodleUserId)`
- Actualiza campos: `moodleUserId`, `sincronizado = true`

---

### 3. Grupo

**Endpoint:** `POST /grupo/:id/sync`

**Descripción:** Confirma que el grupo fue sincronizado exitosamente en Moodle como curso.

**Request Body:**

```json
{
  "moodleCourseId": 123
}
```

**Response:** `200 OK`

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "nombre": "Grupo A",
  "asignaturaNombreSnapshot": "Matemáticas I",
  "docenteNombreSnapshot": "Dr. Roberto Gómez",
  "asignaturaId": "880e8400-e29b-41d4-a716-446655440003",
  "docenteId": "660e8400-e29b-41d4-a716-446655440001",
  "moodleCourseId": 123,
  "sincronizado": true,
  "deletedAt": null,
  "createdAt": "2024-12-01T10:00:00.000Z",
  "updatedAt": "2024-12-03T15:40:00.000Z"
}
```

**Errores:**

- `404 Not Found` - Grupo no encontrado

**Implementación:**

- Service: `GrupoService.confirmMoodleSync(id, moodleCourseId)`
- Actualiza campos: `moodleCourseId`, `sincronizado = true`

---

### 4. Programa de Estudio

**Endpoint:** `POST /programa-estudio/:id/sync`

**Descripción:** Confirma que el programa de estudio fue sincronizado exitosamente en Moodle como categoría.

**Request Body:**

```json
{
  "moodleCategoryId": 12
}
```

**Response:** `200 OK`

```json
{
  "id": "990e8400-e29b-41d4-a716-446655440004",
  "nombre": "Ingeniería en Sistemas Computacionales",
  "cantidadCuatrimestres": 9,
  "moodleCategoryId": 12,
  "sincronizado": true,
  "deletedAt": null,
  "createdAt": "2024-12-01T10:00:00.000Z",
  "updatedAt": "2024-12-03T15:45:00.000Z"
}
```

**Errores:**

- `404 Not Found` - Programa de estudio no encontrado

**Implementación:**

- Service: `ProgramaEstudioService.confirmMoodleSync(id, moodleCategoryId)`
- Actualiza campos: `moodleCategoryId`, `sincronizado = true`

---

## Campos de Sincronización

Cada entidad tiene los siguientes campos para gestionar la sincronización:

| Campo          | Tipo                   | Descripción                                                         |
| -------------- | ---------------------- | ------------------------------------------------------------------- |
| `sincronizado` | `boolean`              | `false` por defecto. Se marca `true` cuando Moodle confirma la sync |
| `moodle*Id`    | `int` (nullable)       | ID del recurso en Moodle. Varía por entidad                         |
| `deletedAt`    | `timestamp` (nullable) | Soft Delete. Cuando se elimina lógicamente, `sincronizado = false`  |

### Mapeo de Campos Moodle

| Entidad              | Campo Moodle       | Recurso en Moodle               |
| -------------------- | ------------------ | ------------------------------- |
| **ProgramaEstudio**  | `moodleCategoryId` | Category                        |
| **Asignatura**       | N/A                | (No se sincroniza directamente) |
| **Docente**          | `moodleUserId`     | User (Teacher)                  |
| **Alumno**           | `moodleUserId`     | User (Student)                  |
| **Grupo**            | `moodleCourseId`   | Course                          |
| **InscripcionGrupo** | `sincronizado`     | Enrolment                       |

---

## Reglas de Negocio

### Regla A: Dirty Flag en Actualizaciones

Cuando se actualiza cualquier campo de una entidad:

```typescript
// El repositorio automáticamente marca:
sincronizado = false;
```

**Ejemplo:**

```typescript
await alumnoService.update(id, { nombre: 'Nuevo Nombre' });
// → sincronizado = false (requiere re-sincronización)
```

### Regla B: Soft Delete

Cuando se elimina lógicamente una entidad:

```typescript
// Se marcan ambos campos:
deletedAt = new Date();
sincronizado = false; // Notifica al Orquestador para eliminar en Moodle
```

**Ejemplo:**

```typescript
await alumnoService.remove(id);
// → deletedAt = NOW, sincronizado = false
```

### Regla C: Invalidación en Cascada

Cuando se actualiza una entidad padre que afecta a hijos:

**Ejemplo: Cambio de nombre de Asignatura**

```typescript
await asignaturaService.update(asignaturaId, { nombre: 'Nuevo Nombre' });
// → Todos los Grupos de esa asignatura: sincronizado = false
```

---

## Endpoints Relacionados

### Obtener Recursos Pendientes de Sincronización

Los siguientes endpoints permiten al Orquestador consultar recursos que requieren sincronización:

#### Alumno

- `GET /alumno/sync/pending` - Alumnos pendientes (`sincronizado = false`, `deletedAt = null`)
- `GET /alumno/sync/deleted` - Alumnos eliminados pendientes (`deletedAt != null`, `sincronizado = false`)
- `POST /alumno/:id/sync` - Confirmar sincronización

#### Docente

- `GET /docente/sync/pending` - Docentes pendientes (`sincronizado = false`, `deletedAt = null`)
- `GET /docente/sync/deleted` - Docentes eliminados pendientes (`deletedAt != null`, `sincronizado = false`)
- `POST /docente/:id/sync` - Confirmar sincronización

#### Grupo

- `GET /grupo/sync/pending` - Grupos pendientes (`sincronizado = false`, `deletedAt = null`)
- `GET /grupo/sync/deleted` - Grupos eliminados pendientes (`deletedAt != null`, `sincronizado = false`)
- `POST /grupo/:id/sync` - Confirmar sincronización

#### ProgramaEstudio

- `GET /programa-estudio/sync/pending` - Programas pendientes (`sincronizado = false`, `deletedAt = null`)
- `GET /programa-estudio/sync/deleted` - Programas eliminados pendientes (`deletedAt != null`, `sincronizado = false`)
- `POST /programa-estudio/:id/sync` - Confirmar sincronización

#### InscripcionGrupo

- `GET /inscripciones-grupo/sync/pending` - Inscripciones pendientes (`sincronizado = false`, `deletedAt = null`)
- `GET /inscripciones-grupo/sync/deleted` - Inscripciones eliminadas pendientes (`deletedAt != null`, `sincronizado = false`)
- `POST /inscripciones-grupo/:id/sync` - Confirmar sincronización

---

## Ejemplo de Uso por el Orquestador

### 1. Consultar Alumnos Pendientes

```http
GET /alumno
```

Filtrar por `sincronizado = false` en el lado del Orquestador o implementar:

```http
GET /alumno/sync/pending
```

### 2. Sincronizar con Moodle

```java
// Orquestador crea usuario en Moodle
MoodleUser user = moodleApi.createUser(alumno);
// Retorna: user.id = 45
```

### 3. Confirmar Sincronización

```http
POST /alumno/550e8400-e29b-41d4-a716-446655440000/sync
Content-Type: application/json

{
  "moodleUserId": 45
}
```

### 4. Verificar Estado

```http
GET /alumno/550e8400-e29b-41d4-a716-446655440000
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "sincronizado": true,
  "moodleUserId": 45
}
```

---

## Swagger Documentation

Todos los endpoints están documentados con Swagger/OpenAPI. Para acceder a la documentación interactiva:

```
http://localhost:3000/api
```

Buscar por la etiqueta correspondiente:

- **Alumnos** → `POST /alumno/{id}/sync`
- **Docentes** → `POST /docente/{id}/sync`
- **Grupos** → `POST /grupo/{id}/sync`
- **Programa de Estudio** → `POST /programa-estudio/{id}/sync`

---

## Archivos Modificados

### Services

- `src/alumno/service/alumno.service.ts` - Método `confirmMoodleSync(id, moodleUserId)`
- `src/docente/service/docente.service.ts` - Método `confirmMoodleSync(id, moodleUserId)`
- `src/grupo/service/grupo.service.ts` - Método `confirmMoodleSync(id, moodleCourseId)`
- `src/programa-estudio/service/programa-estudio.service.ts` - Método `confirmMoodleSync(id, moodleCategoryId)`

### Controllers

- `src/alumno/controller/alumno.controller.ts` - Endpoint `POST :id/sync`
- `src/docente/controller/docente.controller.ts` - Endpoint `POST :id/sync`
- `src/grupo/controller/grupo.controller.ts` - Endpoint `POST :id/sync`
- `src/programa-estudio/controller/programa-estudio.controller.ts` - Endpoint `POST :id/sync`

---

## Estado del Proyecto

✅ **Completado:**

- Campos de sincronización en todas las entidades
- Reglas de negocio (Dirty Flag, Soft Delete, Cascada)
- Endpoints de confirmación de sincronización (`POST /:id/sync`)
- Endpoints de consulta de pendientes (`GET /*/sync/pending`)
- Endpoints de consulta de eliminados (`GET /*/sync/deleted`)
- Documentación Swagger completa
- Compilación exitosa sin errores

⏳ **Pendiente:**

- Migraciones de base de datos
- Tests unitarios y de integración

---

## Notas Técnicas

### Validaciones

- Todos los endpoints validan que el recurso existe (`404 Not Found`)
- Los IDs de Moodle son obligatorios en el request body
- Se utilizan `ParseUUIDPipe` y `ParseIntPipe` para validación de tipos

### Transacciones

Los métodos `confirmMoodleSync` no utilizan transacciones explícitas ya que solo actualizan 2 campos atómicamente.

### Idempotencia

Llamar múltiples veces al mismo endpoint con el mismo `moodleId` es seguro (operación idempotente).

---

**Fecha de Implementación:** 3 de diciembre de 2025  
**Versión:** 0.2A - Entities Branch
