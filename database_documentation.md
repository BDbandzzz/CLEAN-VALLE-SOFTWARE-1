# Documentación General de Base de Datos

## Índice

1. [Visión General](#visión-general)
2. [Diagrama de Relaciones (Resumen)](#diagrama-de-relaciones-resumen)
3. [Módulo: Configuración y Catálogos](#módulo-configuración-y-catálogos)
4. [Módulo: Usuarios y Roles](#módulo-usuarios-y-roles)
5. [Módulo: Categorización de Reportes](#módulo-categorización-de-reportes)
6. [Módulo: Reportes](#módulo-reportes)
7. [Módulo: Asignación y Operadores](#módulo-asignación-y-operadores)
8. [Módulo: Resolución](#módulo-resolución)
9. [Módulo: Notificaciones](#módulo-notificaciones)
10. [Módulo: Evidencias Fotográficas](#módulo-evidencias-fotográficas)
11. [Flujo General del Sistema](#flujo-general-del-sistema)
12. [Consideraciones de Diseño](#consideraciones-de-diseño)

---

## Visión General

Este esquema soporta un sistema de **gestión y seguimiento de reportes** (incidentes, solicitudes o eventos), donde ciudadanos o usuarios registrados pueden crear reportes, los cuales son asignados a operadores especializados para su resolución, con revisión posterior por parte de administradores. El sistema contempla categorización, niveles de riesgo, localización geográfica, notificaciones y evidencia fotográfica.

---

## Diagrama de Relaciones (Resumen)

```
roles ──────────────────────────────────────────────┐
type_dni ───────────────────────────────────────────┤
gender ──────────────────────────────────────────────┼──► users ──► reports ──► assignation_report
state_element ───────────────────────────────────────┘      │               │
                                                             │               └──► resolution ──► resolution_photos
localization ──► subarea_localization ──────────────────────────────► reports
                                                             │
risk_level ──────────────────────────────────────────────────┤
type_category ──► subtype_category ──────────────────────────┤
                │                                            │
                └──► operator_specialization_map ◄── users   │
                                                             │
status_report ───────────────────────────────────────────────┘
resolution_review_status ──► resolution
resolution_quality ──────────► resolution
notification ──► user_notifications ◄── users
reports ──► report_photos
```

---

## Módulo: Configuración y Catálogos

Tablas de referencia que alimentan el resto del sistema. Son datos maestros que rara vez cambian.

---

### `state_element`

Tabla de estados genérica reutilizable en múltiples entidades del sistema.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_state` | integer (PK) | Identificador único |
| `type_state` | varchar | Nombre del estado (ej. "Activo", "Inactivo", "Cerrado") |

**Usada por:** `users`, `type_category`, `assignation_report`

---

### `localization`

Define zonas geográficas o áreas principales de cobertura del sistema.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_localization` | integer (PK) | Identificador único |
| `name` | varchar (UNIQUE) | Nombre del área (ej. "Norte", "Centro") |
| `description` | text | Descripción opcional |

---

### `subarea_localization`

Subdivide cada área de `localization` en zonas más específicas. Los reportes se asocian a estas subáreas.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_subarea` | integer (PK) | Identificador único |
| `id_localization` | integer (FK) | Área padre |
| `name` | varchar | Nombre de la subárea |
| `description` | text | Descripción opcional |

**Relación:** muchos `subarea_localization` pertenecen a una `localization`.

---

### `type_dni`

Catálogo de tipos de documento de identidad aceptados por el sistema.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_type_dni` | integer (PK) | Identificador único |
| `dni_type` | varchar (UNIQUE) | Tipo de documento (ej. "Cédula", "Pasaporte", "NIT") |
| `description` | text | Descripción opcional |

---

### `gender`

Catálogo de géneros para el perfil de usuario.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_gender` | integer (PK) | Identificador único |
| `gender` | varchar (UNIQUE) | Nombre del género |

---

### `risk_level`

Define los niveles de riesgo que se asignan a los reportes, con un puntaje de prioridad y color visual para la UI.

| Columna | Tipo | Descripción |
|---|---|---|
| `risk_id` | integer (PK) | Identificador único |
| `risk_level` | varchar (UNIQUE) | Nombre del nivel (ej. "Bajo", "Medio", "Alto", "Crítico") |
| `description` | text | Descripción del nivel |
| `priority_score` | integer | Valor numérico para ordenar por prioridad (default 0) |
| `color_hex` | varchar | Color en hexadecimal para representación visual |

---

### `status_report`

Estados posibles por los que puede pasar un reporte a lo largo de su ciclo de vida.

| Columna | Tipo | Descripción |
|---|---|---|
| `status_id` | integer (PK) | Identificador único |
| `status_name` | varchar (UNIQUE) | Nombre del estado (ej. "Abierto", "En progreso", "Resuelto") |
| `description` | text | Descripción del estado |
| `is_terminal` | boolean | Indica si es un estado final (no hay transición posterior) |
| `color_hex` | varchar | Color para representación visual |

**Nota:** El flag `is_terminal` permite saber programáticamente cuándo un reporte ya no puede cambiar de estado.

---

### `resolution_review_status`

Estados del proceso de revisión de una resolución por parte de administradores.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_review_status` | integer (PK) | Identificador único |
| `name` | varchar (UNIQUE) | Nombre del estado de revisión (ej. "Pendiente", "Aprobado", "Rechazado") |
| `description` | text | Descripción |
| `is_terminal` | boolean | Indica si la revisión está cerrada definitivamente |

---

### `resolution_quality`

Calificación de la calidad de la resolución emitida por el revisor/administrador.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_quality` | integer (PK) | Identificador único |
| `name` | varchar (UNIQUE) | Nombre de la calidad (ej. "Excelente", "Aceptable", "Deficiente") |
| `score` | integer | Puntaje numérico asociado (útil para métricas de desempeño) |
| `description` | text | Descripción del criterio |

---

## Módulo: Usuarios y Roles

Gestión de identidad, autenticación y perfiles de usuario.

---

### `roles`

Define los roles del sistema que determinan los permisos y capacidades de cada usuario.

| Columna | Tipo | Descripción |
|---|---|---|
| `role_id` | integer (PK) | Identificador único |
| `role_name` | varchar (UNIQUE) | Nombre del rol (ej. "Admin", "Operador", "Ciudadano") |
| `description` | text | Descripción del rol |
| `color_hex` | varchar | Color visual para identificación en la UI |

---

### `users`

Tabla central de usuarios del sistema. Se integra con un sistema de autenticación externo (Supabase Auth u otro proveedor) mediante `auth_id`.

| Columna | Tipo | Descripción |
|---|---|---|
| `code_user` | varchar (PK) | Código interno único del usuario |
| `auth_id` | uuid (UNIQUE, FK) | ID del proveedor de autenticación externo (`auth.users`) |
| `id_role` | integer (FK) | Rol del usuario |
| `id_type_dni` | integer (FK) | Tipo de documento de identidad |
| `id_gender` | integer (FK) | Género |
| `id_state` | integer (FK) | Estado del usuario (activo/inactivo) |
| `first_name` | varchar | Nombre |
| `last_name` | varchar | Apellido |
| `dni_user` | varchar (UNIQUE) | Número de documento de identidad |
| `deleted_at` | timestamptz | Timestamp de eliminación lógica (soft delete) |

**Notas importantes:**
- El campo `deleted_at` implementa **soft delete**: los usuarios no se borran físicamente, se marca la fecha de eliminación. Las consultas deben filtrar `WHERE deleted_at IS NULL` para obtener usuarios activos.
- `auth_id` es la llave de integración con el sistema de autenticación; se usa como FK en varias tablas para vincular acciones al usuario autenticado.

---

### `operator_profile`

Perfil extendido exclusivo para usuarios con rol de operador. Controla la carga de trabajo máxima permitida.

| Columna | Tipo | Descripción |
|---|---|---|
| `code_operator` | varchar (FK) | Referencia al `code_user` del usuario operador |
| `current_active_reports` | integer | Cantidad de reportes activos actualmente asignados |
| `max_active_reports` | integer | Límite máximo de reportes activos (default: 5) |
| `created_at` | timestamptz | Fecha de creación del perfil |

**Nota:** Esta tabla no tiene PK propia explícita en el esquema, lo que implica que `code_operator` funciona de facto como identificador único. La lógica de asignación debe verificar que `current_active_reports < max_active_reports` antes de asignar un nuevo reporte.

---

### `operator_specialization_map`

Registra las especializaciones de cada operador según categorías de reportes. Permite asignaciones inteligentes por competencia.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_specialization` | integer (PK) | Identificador único |
| `name_specialization` | varchar | Nombre de la especialización |
| `id_operator` | uuid (FK) | `auth_id` del operador |
| `id_category` | integer (FK) | Categoría de reporte en la que está especializado |

**Relación:** un operador puede tener múltiples especializaciones en distintas categorías.

---

## Módulo: Categorización de Reportes

Define la taxonomía de dos niveles para clasificar los reportes.

---

### `type_category`

Categorías principales de los reportes (primer nivel de clasificación).

| Columna | Tipo | Descripción |
|---|---|---|
| `id_category` | integer (PK) | Identificador único |
| `id_state` | integer (FK) | Estado de la categoría (activa/inactiva) |
| `name` | varchar (UNIQUE) | Nombre de la categoría (ej. "Infraestructura", "Seguridad") |
| `color_hex` | varchar | Color visual para la UI |
| `description` | text | Descripción |

---

### `subtype_category`

Subcategorías que refinan la clasificación dentro de cada `type_category` (segundo nivel).

| Columna | Tipo | Descripción |
|---|---|---|
| `id_subtype` | integer (PK) | Identificador único |
| `id_category` | integer (FK) | Categoría padre |
| `name` | varchar | Nombre de la subcategoría (ej. "Bache", "Alumbrado público") |
| `description` | text | Descripción |

**Relación:** Los reportes se vinculan a `subtype_category`, lo que permite inferir la categoría padre y asignar al operador especializado correspondiente.

---

## Módulo: Reportes

Núcleo del sistema. Registra todos los eventos/incidentes reportados.

---

### `reports`

Tabla principal del sistema. Cada fila representa un reporte creado por un usuario.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_report` | integer (PK) | Identificador único del reporte |
| `risk_id` | integer (FK) | Nivel de riesgo asignado |
| `id_subtype` | integer (FK) | Subcategoría del reporte |
| `status_report` | integer (FK) | Estado actual del reporte |
| `id_subarea` | integer (FK, nullable) | Subárea geográfica donde ocurrió el evento |
| `reporter_auth_id` | uuid (FK) | `auth_id` del usuario que creó el reporte |
| `title` | varchar | Título descriptivo del reporte |
| `description` | text | Descripción detallada del evento |
| `created_at` | timestamptz | Fecha/hora de creación del reporte |
| `occurred_at` | timestamptz | Fecha/hora en que ocurrió el evento (puede diferir de `created_at`) |
| `updated_at` | timestamptz | Última actualización del reporte |

**Notas:**
- `id_subarea` es nullable, lo que permite reportes sin localización específica.
- La diferencia entre `created_at` y `occurred_at` permite registrar eventos pasados.
- El estado (`status_report`) evoluciona a lo largo del flujo: creación → asignación → resolución → revisión.

---

## Módulo: Asignación y Operadores

Gestiona la asignación de reportes a operadores para su atención.

---

### `assignation_report`

Registra cada asignación de un reporte a un operador. Permite historial completo de reasignaciones.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | integer (PK) | Identificador único de la asignación |
| `id_report` | integer (FK) | Reporte asignado |
| `id_operator` | uuid (FK) | `auth_id` del operador asignado |
| `id_admin` | uuid (FK, nullable) | `auth_id` del administrador que realizó la asignación |
| `asignated_at` | timestamptz | Fecha/hora de la asignación |
| `closed_at` | timestamptz | Fecha/hora de cierre de la asignación |
| `id_state` | integer (FK) | Estado de la asignación |
| `assignment_notes` | text | Notas o instrucciones del administrador al operador |

**Notas:**
- `id_admin` es nullable, lo que sugiere la posibilidad de asignaciones automáticas (sin intervención de un admin).
- Un mismo reporte puede tener múltiples registros en esta tabla si fue reasignado.
- `closed_at` marca el fin de una asignación particular.

---

## Módulo: Resolución

Registra la solución aplicada por el operador y la revisión posterior.

---

### `resolution`

Tabla 1-a-1 con `reports`. Contiene la resolución emitida por el operador y la revisión del administrador.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_report` | integer (PK, FK) | Referencia al reporte resuelto |
| `id_operator` | uuid (FK, nullable) | `auth_id` del operador que resolvió |
| `description` | text | Descripción de la solución aplicada |
| `id_quality` | integer (FK, nullable) | Calificación de la calidad de la resolución |
| `id_review_status` | integer (FK) | Estado de la revisión por parte del administrador |
| `resolution_method` | varchar | Método o procedimiento utilizado para resolver |
| `resolved_at` | timestamptz | Fecha/hora en que se resolvió |
| `manager_feedback` | text | Retroalimentación del administrador |
| `reviewed_at` | timestamptz | Fecha/hora de la revisión |
| `reviewed_by` | uuid (FK, nullable) | `auth_id` del admin que revisó |

**Notas:**
- La relación 1-a-1 con `reports` (mediante `id_report` como PK) garantiza que cada reporte tiene como máximo una resolución.
- `id_quality` y `reviewed_by` son nullables porque se completan en la fase de revisión, posterior a la resolución inicial.
- El flujo es: operador completa → admin revisa → admin califica y da feedback.

---

## Módulo: Notificaciones

Sistema de notificaciones internas para usuarios.

---

### `notification`

Define el contenido de una notificación. Es una plantilla reutilizable.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_notification` | integer (PK) | Identificador único |
| `title` | varchar | Título de la notificación |
| `reason` | text | Cuerpo/razón de la notificación |

---

### `user_notifications`

Tabla de intersección que vincula notificaciones con usuarios específicos. Implementa el patrón de bandeja de entrada.

| Columna | Tipo | Descripción |
|---|---|---|
| `id_notification` | integer (PK, FK) | Referencia a la notificación |
| `auth_id` | uuid (PK, FK) | `auth_id` del usuario receptor |
| `is_read` | boolean | Si el usuario ha leído la notificación (default: false) |
| `send_date` | timestamptz | Fecha/hora de envío |

**Relación:** PK compuesta (`id_notification`, `auth_id`) — una notificación puede enviarse a múltiples usuarios, y cada usuario puede tener múltiples notificaciones.

---

## Módulo: Evidencias Fotográficas

Almacena referencias a imágenes asociadas a reportes y resoluciones.

---

### `report_photos`

Fotos adjuntadas al momento de crear o actualizar un reporte (evidencia del problema).

| Columna | Tipo | Descripción |
|---|---|---|
| `id_photo` | uuid (PK) | Identificador único generado automáticamente |
| `id_report` | integer (FK) | Reporte al que pertenece la foto |
| `file_path` | text (UNIQUE) | Ruta o URL del archivo en el sistema de almacenamiento |
| `created_at` | timestamptz | Fecha/hora de carga |

---

### `resolution_photos`

Fotos adjuntadas como evidencia de la resolución (evidencia de la solución).

| Columna | Tipo | Descripción |
|---|---|---|
| `id_photo` | uuid (PK) | Identificador único generado automáticamente |
| `id_report` | integer (FK) | Resolución a la que pertenece la foto (referencia a `resolution.id_report`) |
| `file_path` | text (UNIQUE) | Ruta o URL del archivo |
| `created_at` | timestamptz | Fecha/hora de carga |

**Nota:** El `file_path` es UNIQUE en ambas tablas, evitando duplicados de archivos en el almacenamiento.

---

## Flujo General del Sistema

```
1. CREACIÓN
   Usuario (reporter) crea un reporte
   → se registra en `reports` con status inicial y riesgo
   → puede adjuntar fotos en `report_photos`

2. ASIGNACIÓN
   Admin (o sistema automático) asigna el reporte a un operador
   → se crea registro en `assignation_report`
   → se verifica `operator_profile.current_active_reports < max_active_reports`
   → la asignación considera `operator_specialization_map` para match con la categoría

3. ATENCIÓN
   Operador trabaja el reporte
   → el status del reporte en `reports` se actualiza progresivamente

4. RESOLUCIÓN
   Operador documenta la solución
   → se crea registro en `resolution` con descripción y método
   → puede adjuntar fotos en `resolution_photos`
   → `resolved_at` se registra

5. REVISIÓN
   Admin revisa la resolución
   → actualiza `resolution.id_review_status`
   → asigna `id_quality` y escribe `manager_feedback`
   → registra `reviewed_at` y `reviewed_by`

6. CIERRE
   El reporte alcanza un `status_report` con `is_terminal = true`
   → `assignation_report.closed_at` se registra
   → Se envían notificaciones vía `notification` + `user_notifications`
```

---

## Consideraciones de Diseño

### Soft Delete
La tabla `users` implementa eliminación lógica con `deleted_at`. Los usuarios "eliminados" conservan su historial de reportes y asignaciones. Toda consulta sobre usuarios activos debe incluir `WHERE deleted_at IS NULL`.

### Integración con Auth externo
El campo `auth_id` (uuid) en `users` y su uso como FK en múltiples tablas indica integración con un proveedor de autenticación externo (probablemente **Supabase Auth**). La referencia `auth.users(id)` confirma esto. La identidad operativa del usuario en el sistema se gestiona por `auth_id`, mientras que `code_user` es el identificador interno de negocio.

### Taxonomía de dos niveles
La combinación `type_category → subtype_category` permite una clasificación flexible. Los reportes se vinculan siempre al `subtype`, lo que permite queries tanto a nivel de subcategoría como de categoría padre mediante JOIN.

### Estados reutilizables vs. estados específicos
El sistema usa dos enfoques:
- `state_element`: estados genéricos reutilizados en usuarios, categorías y asignaciones.
- `status_report` y `resolution_review_status`: estados específicos con semántica propia (`is_terminal`), dando más control sobre el ciclo de vida de reportes y revisiones.

### Carga de operadores
`operator_profile` centraliza el control de carga con `current_active_reports` y `max_active_reports`. Este contador debe mantenerse sincronizado mediante triggers de base de datos o lógica de aplicación al crear/cerrar asignaciones.

### Trazabilidad completa
El diseño permite reconstruir el historial completo de un reporte: quién lo creó, quién lo asignó, quién lo atendió, cómo se resolvió, quién lo revisó y con qué calificación. Esto es útil para auditorías y métricas de desempeño.

### Fotos desacopladas
`report_photos` y `resolution_photos` almacenan solo rutas (`file_path`), asumiendo que los archivos físicos se almacenan en un servicio externo (S3, Supabase Storage, etc.). El `UNIQUE` en `file_path` previene registros duplicados del mismo archivo.
