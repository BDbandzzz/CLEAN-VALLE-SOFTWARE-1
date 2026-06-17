# CleanValle - Estructura y arquitectura del proyecto

## Integrantes

- Bryan David Garces Quintero
- Adony Gabriel Perea

## Tablero Jira
- https://cleanvalle.atlassian.net/jira/software/projects/CVS1/boards/1/timeline?selectedIssue=CVS1-89
## Link de aplicacion desplegada
- http://cleanvalle.ds1.eleueleo.com/manager/reports

## Descripcion general

CleanValle es una aplicacion web orientada a la gestion de reportes de problemas universitarios. El sistema permite registrar reportes, consultar su estado, asignarlos a operadores, registrar resoluciones y administrar la informacion necesaria para el funcionamiento de la plataforma.

La aplicacion contempla diferentes tipos de usuario, entre ellos estudiantes, docentes, operadores, gestores y administradores. Las funciones y rutas disponibles se controlan de acuerdo con el rol del usuario autenticado.

## Tecnologias principales

- **React 19:** construccion de la interfaz mediante componentes.
- **Vite:** entorno de desarrollo y empaquetado de la aplicacion.
- **React Router:** navegacion y proteccion de rutas.
- **Supabase:** autenticacion, base de datos, almacenamiento de imagenes y funciones del backend.
- **Tailwind CSS:** estilos y diseno visual.
- **Chart.js:** graficos de los paneles de control.
- **Radix UI y shadcn:** componentes reutilizables de interfaz.

## Arquitectura base

El proyecto utiliza una **arquitectura modular por funcionalidades**, complementada con una separacion por capas. Cada modulo agrupa las paginas, componentes, hooks, contextos y utilidades relacionados con una funcion especifica del sistema.

La arquitectura se divide principalmente en:

1. **Capa de presentacion:** paginas, componentes visuales y formularios.
2. **Capa de estado y logica de interfaz:** contextos y hooks que coordinan el estado y las acciones de cada modulo.
3. **Capa de servicios:** comunica la aplicacion con Supabase y concentra las operaciones externas.
4. **Capa de infraestructura compartida:** enrutamiento, autenticacion, layouts, constantes, componentes comunes y proveedores globales.

### Flujo general

```text
Usuario
  |
  v
Pagina o componente
  |
  v
Hook o contexto
  |
  v
Servicio
  |
  v
Supabase
  |- Autenticacion
  |- Base de datos
  |- Storage
  `- Edge Functions
```

Este flujo evita que los componentes visuales dependan directamente de la implementacion del backend y facilita el mantenimiento de cada funcionalidad.

## Estructura principal

```text
CLEAN-VALLE-SOFTWARE-1/
|-- public/                         # Recursos publicos
|-- src/
|   |-- core/                       # Infraestructura y elementos compartidos
|   |   |-- components/             # Componentes reutilizables
|   |   |-- constants/              # Constantes globales y del dominio
|   |   |-- context/                # Contextos globales
|   |   |-- layouts/                # Estructuras visuales generales
|   |   |-- lib/                    # Funciones auxiliares
|   |   |-- mappers/                # Transformacion de datos
|   |   |-- providers/              # Proveedores globales
|   |   |-- router/                 # Rutas y control de acceso
|   |   |-- services/               # Servicios transversales de la interfaz
|   |   `-- styles/                 # Estilos globales
|   |-- modules/                    # Funcionalidades del sistema
|   |-- services/                   # Comunicacion con Supabase
|   |-- App.jsx                     # Componente raiz
|   `-- main.jsx                    # Punto de entrada
|-- supabase/
|   |-- functions/                  # Funciones ejecutadas en Supabase
|   `-- config.toml                 # Configuracion local de Supabase
|-- database_documentation.md       # Documentacion de la base de datos
|-- vite.config.js                  # Configuracion de Vite
`-- package.json                    # Dependencias y comandos del proyecto
```

## Elementos de `core`

La carpeta `src/core` contiene los recursos utilizados por varios modulos:

- **components:** campos, botones, tarjetas, alertas, graficos y otros componentes reutilizables.
- **constants:** rutas, roles, mensajes, configuracion de navegacion y valores del dominio.
- **context:** estado global de autenticacion.
- **layouts:** barra de navegacion y estructura principal de las paginas privadas.
- **providers:** integra autenticacion, alertas, notificaciones, reportes y enrutamiento.
- **router:** define rutas publicas, privadas y restricciones por rol.
- **mappers:** adapta los datos recibidos para su uso en la interfaz.
- **lib:** utilidades generales.
- **services:** manejo compartido de alertas y mensajes de error.
- **styles:** estilos globales de la aplicacion.

## Modulos funcionales

Los modulos se encuentran en `src/modules` y estan separados segun su responsabilidad:

| Modulo | Responsabilidad |
|---|---|
| `landing` | Presenta la pagina publica inicial y la informacion general de CleanValle. |
| `auth` | Gestiona el inicio de sesion, recuperacion de contrasena y activacion de cuentas invitadas. |
| `security` | Permite cambiar la contrasena de un usuario autenticado. |
| `profile` | Muestra y permite gestionar la informacion del perfil del usuario. |
| `reports` | Permite crear reportes, consultar reportes propios y visualizar reportes resueltos. |
| `notifications` | Administra la visualizacion y lectura de notificaciones. |
| `operator` | Gestiona las asignaciones del operador y el registro de resoluciones. |
| `manager-reports` | Permite revisar, agrupar, asignar y dar seguimiento a reportes y resoluciones. |
| `dashboard-manager` | Presenta el panel principal del gestor. |
| `dashboard-admin` | Presenta metricas y accesos administrativos. |
| `users-admin` | Gestiona la creacion, edicion y activacion de usuarios. |
| `report-types-admin` | Administra categorias, tipos y subtipos de reporte. |
| `locations-admin` | Administra localizaciones y subareas utilizadas en los reportes. |
| `specializations-admin` | Administra las especializaciones asociadas con operadores y categorias. |
| `gestor` | Estructura reservada para funcionalidades del rol gestor; las funciones activas se encuentran actualmente en `manager-reports` y `dashboard-manager`. |

### Estructura interna de un modulo

Dependiendo de su complejidad, un modulo puede contener:

```text
modulo/
|-- components/     # Componentes propios de la funcionalidad
|-- pages/          # Vistas asociadas con rutas
|-- hooks/          # Logica reutilizable de React
|-- context/        # Estado compartido dentro del modulo
|-- services/       # Servicios locales, si fueran necesarios
|-- data/           # Repositorios o adaptadores de datos
|-- constants/      # Valores fijos del modulo
`-- utils/          # Validaciones y funciones auxiliares
```

No todos los modulos necesitan todas estas carpetas. La estructura se adapta a las necesidades de cada funcionalidad.

## Enrutamiento y seguridad

Las rutas se centralizan en `src/core/router/AppRouter.jsx`. El sistema maneja tres tipos principales de acceso:

- **Rutas publicas:** pagina inicial, inicio de sesion y consulta publica de reportes resueltos.
- **Rutas para invitados:** pantallas que solo deben mostrarse cuando no existe una sesion activa.
- **Rutas privadas:** requieren autenticacion y utilizan el layout principal.

`PrivateRoute` valida la sesion y, cuando corresponde, comprueba que el usuario tenga uno de los roles autorizados. Si el usuario no tiene acceso, es redirigido a una pagina permitida.

## Estado global

`AppProviders` agrupa los proveedores generales de la aplicacion:

- **AlertProvider:** muestra mensajes de exito, advertencia y error.
- **BrowserRouter:** habilita la navegacion.
- **AuthProvider:** conserva la sesion y los datos del usuario autenticado.
- **NotificationProvider:** administra notificaciones.
- **ReportsProvider:** comparte informacion relacionada con reportes.

Los contextos especificos de administracion se cargan solamente en las rutas que los necesitan.

## Capa de servicios

La carpeta `src/services` concentra la comunicacion con Supabase. Su responsabilidad es ejecutar consultas, autenticacion, almacenamiento y operaciones del negocio, entregando a la interfaz datos listos para utilizar.

| Servicio | Funcion |
|---|---|
| `supabaseClient.js` | Configura y exporta el cliente de Supabase. |
| `authService.js` | Gestiona inicio de sesion, cierre de sesion y datos de autenticacion. |
| `passwordRecoveryService.js` | Gestiona la recuperacion y actualizacion de contrasenas. |
| `userInvitationService.js` | Valida invitaciones y permite establecer la contrasena inicial. |
| `reportService.js` | Crea reportes y consulta reportes propios o resueltos. |
| `reportCatalogService.js` | Obtiene y almacena temporalmente los catalogos usados por los reportes. |
| `reportStorageService.js` | Sube fotografias y genera enlaces para visualizar archivos. |
| `notificationService.js` | Consulta, actualiza y escucha notificaciones. |
| `operatorReportService.js` | Gestiona asignaciones y resoluciones del operador. |
| `managerReportService.js` | Gestiona revision, asignacion y agrupacion de reportes. |
| `adminDashboardService.js` | Obtiene los datos del panel administrativo. |
| `adminUserService.js` | Gestiona usuarios desde el modulo administrativo. |
| `adminReportTypeService.js` | Gestiona tipos y categorias de reporte. |
| `adminLocationService.js` | Gestiona localizaciones y subareas. |
| `adminSpecializationService.js` | Gestiona especializaciones. |

En `src/core/services` se encuentran servicios transversales:

- `alertService.js`: publica alertas para la interfaz.
- `errorMessageService.js`: transforma errores tecnicos en mensajes controlados para el usuario.

## Integracion con Supabase

Supabase funciona como backend del proyecto y proporciona:

- Autenticacion y persistencia de sesiones.
- Acceso a la base de datos.
- Procedimientos y consultas para las operaciones del negocio.
- Almacenamiento de fotografias de reportes y resoluciones.
- Notificaciones en tiempo real.
- Edge Function `admin-create-user` para la creacion administrativa de usuarios.

Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` deben estar disponibles en el entorno para inicializar la conexion.

## Inicio de la aplicacion

El arranque sigue este orden:

1. `main.jsx` monta la aplicacion en el elemento `root`.
2. `App.jsx` incorpora los proveedores globales.
3. `AppRouter.jsx` selecciona la pagina segun la URL.
4. Las rutas privadas validan la sesion y el rol.
5. La pagina utiliza hooks, contextos y servicios para ejecutar sus operaciones.
