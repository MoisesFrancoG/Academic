# Módulo de Inscripciones de Grupo

## 📋 Descripción

Este módulo maneja las inscripciones de alumnos a grupos, reemplazando la relación `ManyToMany` automática de TypeORM por una entidad explícita que soporta:

- ✅ **Soft Delete**: Rastreo de des-inscripciones para Moodle
- ✅ **Dirty Flags**: Campo `sincronizado` para el Orquestador
- ✅ **Timestamps**: Auditoría completa de creación y eliminación

## 🗂️ Estructura

```
inscripciones-grupo/
├── entities/
│   └── inscripcion-grupo.entity.ts    # Entidad principal
├── DTOs/
│   ├── create-inscripcion-grupo.dto.ts
│   ├── inscripcion-grupo-response.dto.ts
│   └── index.ts
├── repository/
│   ├── inscripcion-grupo.repository.interface.ts
│   ├── inscripcion-grupo.repository.ts
│   ├── inscripcion-grupo.providers.ts
│   └── repository.module.ts
├── service/
│   ├── inscripcion-grupo.service.ts
│   └── service.module.ts
├── controller/
│   ├── inscripcion-grupo.controller.ts
│   └── controller.module.ts
└── inscripcion-grupo.module.ts
```

## 🔄 Integración con Moodle

### Campos de Sincronización

- `sincronizado` (boolean): Bandera que indica si el cambio fue enviado a Moodle
- `deletedAt` (timestamp): Fecha de eliminación lógica

### Endpoints para el Orquestador

- `GET /inscripciones-grupo/sync/pending` - Nuevas inscripciones por sincronizar
- `GET /inscripciones-grupo/sync/deleted` - Des-inscripciones por sincronizar
- `POST /inscripciones-grupo/:id/sync` - Marcar como sincronizada

## 🎯 Uso

### Inscribir alumno a grupo

```typescript
POST /inscripciones-grupo
{
  "grupoId": "uuid-del-grupo",
  "alumnoId": "uuid-del-alumno"
}
```

### Desinscribir alumno (Soft Delete)

```typescript
DELETE /inscripciones-grupo/:id
```

Esto marca `deletedAt` y establece `sincronizado = false` para que el Orquestador lo detecte.

## ⚠️ Cambios en Otras Entidades

### Grupo Entity

- ❌ Eliminada: `@ManyToMany(() => Alumno)`
- ✅ Agregada: `@OneToMany(() => InscripcionGrupo, ...)`

### Alumno Entity

- ❌ Eliminada: `@ManyToMany(() => Grupo, ...)`
- ✅ Agregada: `@OneToMany(() => InscripcionGrupo, ...)`
