# Esquema de Base de Datos - Sistema Académico

## ✅ Entidades Implementadas

Se han creado exitosamente las 5 entidades del sistema académico con sus respectivas relaciones usando TypeORM y UUID como clave primaria.

---

## 📊 Diagrama de Relaciones

```
ProgramaEstudio (1) ──────> (M) Asignatura
                                    │
                                    │ (1)
                                    ▼
                                 Grupo (M) ◄────── (1) Docente
                                    │                    │
                                    │ (M)                │ (M)
                                    │                    │
                                    └──────────┬─────────┘
                                               │
                                               │ (M)
                                               ▼
                                            Alumno

Competencias: Docente (M) ◄──────────► (M) Asignatura
Inscripciones: Grupo (M) ◄──────────► (M) Alumno
```

---

## 🗃️ Entidades Detalladas

### 1. ProgramaEstudio

**Archivo:** `src/programa-estudio/entities/programa-estudio.entity.ts`

```typescript
@Entity('programa_estudio')
class ProgramaEstudio {
  id: string; // UUID
  nombre: string; // Unique
  cantidadCuatrimestres: number;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  asignaturas: Asignatura[]; // OneToMany
}
```

**Descripción:** Representa las carreras o programas académicos de la institución.

---

### 2. Asignatura

**Archivo:** `src/asignatura/entities/asignatura.entity.ts`

```typescript
@Entity('asignatura')
class Asignatura {
  id: string; // UUID
  nombre: string;
  cuatrimestre: number;
  programaEstudioId: string; // FK
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  programaEstudio: ProgramaEstudio; // ManyToOne (CASCADE)
  grupos: Grupo[]; // OneToMany
}
```

**Descripción:** Representa las materias o asignaturas que pertenecen a un programa de estudio.

---

### 3. Docente

**Archivo:** `src/docente/entities/docente.entity.ts`

```typescript
@Entity('docente')
class Docente {
  id: string; // UUID
  nombre: string;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  asignaturasCompetencia: Asignatura[]; // ManyToMany con @JoinTable
  grupos: Grupo[]; // OneToMany
}
```

**Descripción:** Representa los profesores/docentes del sistema.

**Tabla Pivot:** `docente_competencias` (docente_id, asignatura_id) - Relaciona docentes con las asignaturas que pueden impartir.

---

### 4. Alumno

**Archivo:** `src/alumno/entities/alumno.entity.ts`

```typescript
@Entity('alumno')
class Alumno {
  id: string; // UUID
  nombre: string;
  matricula: string; // Unique
  cuatrimestreActual: number;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  grupos: Grupo[]; // ManyToMany (inverse side)
}
```

**Descripción:** Representa los estudiantes del sistema.

---

### 5. Grupo

**Archivo:** `src/grupo/entities/grupo.entity.ts`

```typescript
@Entity('grupo')
class Grupo {
  id: string;                         // UUID
  nombre: string;                     // Ej: "9A", "1B"
  asignaturaNombreSnapshot: string;   // Snapshot
  docenteNombreSnapshot: string;      // Snapshot
  asignaturaId: string;               // FK
  docenteId: string;                  // FK
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  asignatura: Asignatura;             // ManyToOne
  docente: Docente;                   // ManyToOne
  alumnos: Alumno[];                  // ManyToMany con @JoinTable

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  updateSnapshots() { ... }
}
```

**Descripción:** Entidad central que conecta Asignatura, Docente y Alumnos. Incluye campos snapshot para mantener el historial de nombres.

**Tabla Pivot:** `inscripciones_grupo` (grupo_id, alumno_id) - Relaciona grupos con alumnos inscritos.

**Hooks:** Los métodos `@BeforeInsert()` y `@BeforeUpdate()` actualizan automáticamente los snapshots de nombres.

---

## 🔑 Características Implementadas

### ✅ UUIDs como Primary Keys

Todas las entidades utilizan `@PrimaryGeneratedColumn('uuid')` en lugar de auto-increment integers.

### ✅ Relaciones TypeORM

- **OneToMany / ManyToOne:** ProgramaEstudio → Asignatura, Asignatura → Grupo, Docente → Grupo
- **ManyToMany:** Docente ↔ Asignatura (competencias), Grupo ↔ Alumno (inscripciones)
- **@JoinTable:** En el lado "owning" de relaciones ManyToMany (Docente, Grupo)
- **@JoinColumn:** Especifica nombres de columnas FK en relaciones ManyToOne

### ✅ Cascading

La relación `ProgramaEstudio → Asignatura` tiene `{ onDelete: 'CASCADE' }` para eliminación en cascada.

### ✅ Snapshots (Grupo)

Campos snapshot que preservan nombres históricos de asignatura y docente usando hooks `@BeforeInsert/@BeforeUpdate`.

### ✅ Timestamps

Todas las entidades tienen `createdAt` y `updatedAt` con `@CreateDateColumn` y `@UpdateDateColumn`.

### ✅ Constraints

- `nombre` es UNIQUE en `ProgramaEstudio`
- `matricula` es UNIQUE en `Alumno`

---

## 📋 Tablas Generadas

TypeORM generará las siguientes tablas:

1. **programa_estudio** - Programas académicos
2. **asignatura** - Materias del sistema
3. **docente** - Profesores
4. **alumno** - Estudiantes
5. **grupo** - Grupos de clase
6. **docente_competencias** - Pivot: Docente ↔ Asignatura
7. **inscripciones_grupo** - Pivot: Grupo ↔ Alumno

---

## 🔄 Estado de Actualización

### ✅ Completado - ProgramaEstudio Module

- ✅ Entidad actualizada a UUID
- ✅ Interface repository actualizada (string IDs)
- ✅ Repository implementation actualizada (string IDs)
- ✅ Service actualizado (string IDs)
- ✅ Controller actualizado (ParseUUIDPipe)
- ✅ Relación OneToMany con Asignatura descomentada

### ✅ Completado - Nuevas Entidades

- ✅ Asignatura entity creada con UUID y relaciones
- ✅ Docente entity creada con UUID y relaciones ManyToMany
- ✅ Alumno entity creada con UUID
- ✅ Grupo entity creada con UUID, snapshots y hooks

### ⚠️ Pendiente - Nuevos Módulos Completos

Los siguientes módulos necesitan implementación completa (DTOs, Repository, Service, Controller, Module):

- Asignatura module
- Docente module
- Alumno module
- Grupo module

---

## 🚀 Próximos Pasos

Para completar la implementación del sistema académico:

1. **Crear módulo Asignatura** (siguiendo el patrón de ProgramaEstudio)
   - DTOs (CreateAsignaturaDto, UpdateAsignaturaDto, AsignaturaResponseDto)
   - Repository interface y implementation
   - Service con lógica de negocio
   - Controller con endpoints REST
   - Module con providers

2. **Crear módulo Docente**
   - DTOs con gestión de competencias
   - Repository para docentes
   - Service con validaciones
   - Controller REST
   - Module

3. **Crear módulo Alumno**
   - DTOs con validación de matrícula única
   - Repository para alumnos
   - Service con lógica de inscripción
   - Controller REST
   - Module

4. **Crear módulo Grupo**
   - DTOs con referencias a asignatura y docente
   - Repository especializado (manejo de snapshots)
   - Service con lógica de inscripciones
   - Controller REST con endpoints para gestionar alumnos
   - Module

5. **Registrar entidades en DatabaseModule**
   - Agregar todos los providers de entidades en `database.providers.ts`
   - Importar DatabaseModule en todos los módulos de entidades

6. **Testing**
   - Probar relaciones entre entidades
   - Validar cascading deletes
   - Verificar snapshots en Grupo
   - Testing e2e de todos los endpoints

---

## 📝 Notas Técnicas

### Naming Conventions

- **Entidades TypeScript:** PascalCase (ProgramaEstudio, Asignatura)
- **Tablas DB:** snake_case (programa_estudio, asignatura)
- **Columnas DB:** snake_case (programa_estudio_id, created_at)
- **Properties TS:** camelCase (programaEstudioId, createdAt)

### UUID Format

TypeORM generará UUIDs v4 automáticamente:

```
550e8400-e29b-41d4-a716-446655440000
```

### Migration Strategy

Se recomienda generar y ejecutar migraciones TypeORM:

```bash
pnpm run migration:generate -- src/migrations/CreateAcademicSchema
pnpm run migration:run
```

---

## ✅ Compilación Exitosa

El proyecto compila sin errores con todas las entidades y relaciones implementadas correctamente.

```bash
✓ pnpm run build
```
