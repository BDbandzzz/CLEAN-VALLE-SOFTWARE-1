
Cleanvalle arquitectura · MD
# CleanValle - Estructura y arquitectura del proyecto
 
## Índice
 
- [Integrantes](#integrantes)
- [Información del proyecto](#información-del-proyecto)
- [Descripción general](#descripción-general)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Tecnologías principales](#tecnologías-principales)
- [Arquitectura base](#arquitectura-base)
- [Estructura principal](#estructura-principal)
- [Elementos de core](#elementos-de-core)
- [Módulos funcionales](#módulos-funcionales)
- [Enrutamiento y seguridad](#enrutamiento-y-seguridad)
- [Estado global](#estado-global)
- [Capa de servicios](#capa-de-servicios)
- [Integración con Supabase](#integración-con-supabase)
- [Inicio de la aplicación](#inicio-de-la-aplicación)
## Integrantes
 
- Bryan David Garces Quintero
- Adony Gabriel Perea
## Información del proyecto
 
- **Tablero Jira:** https://cleanvalle.atlassian.net/jira/software/projects/CVS1/boards/1/timeline?selectedIssue=CVS1-89
- **Aplicación desplegada:** http://cleanvalle.ds1.eleueleo.com
## Descripción general
 
CleanValle es una aplicación web orientada a la gestión de reportes de problemas universitarios. El sistema permite registrar reportes, consultar su estado, asignarlos a operadores, registrar resoluciones y administrar la información necesaria para el funcionamiento de la plataforma.
 
La aplicación contempla diferentes tipos de usuario, entre ellos estudiantes, docentes, operadores, gestores y administradores. Las funciones y rutas disponibles se controlan de acuerdo con el rol del usuario autenticado.
 
## Capturas de pantalla
 
A continuación se muestran algunas vistas representativas del sistema, organizadas según el recorrido típico de un usuario.
 
**Página pública**
 
Página de inicio de CleanValle, con acceso al inicio de sesión y a la consulta pública de reportes resueltos.
 
<img width="1365" height="767" alt="image" src="https://github.com/user-attachments/assets/6619db31-07af-487d-a810-15c1cd56d5dc" />

 
**Inicio de sesión**
 
Formulario de autenticación para usuarios registrados.
 
<img width="1350" height="653" alt="image" src="https://github.com/user-attachments/assets/0fb96e34-7b39-4296-a387-150836dcab50" />
 
**Creación de un reporte**
 
Formulario de creación de reportes, con selección de tipo de reporte, razón y nivel de riesgo.
 
<img width="1365" height="665" alt="image" src="https://github.com/user-attachments/assets/bcfc32db-842c-4acd-9186-8fe45fd16eff" />
 
**Agrupación de reportes**
 
Vista del gestor para seleccionar y agrupar reportes que pertenecen a la misma categoría.
 
 
**Panel del gestor**
 
Panel principal del gestor, con métricas generales y la distribución de reportes por estado y nivel de riesgo.
 
 <img width="1352" height="655" alt="Captura de pantalla 2026-06-17 152037" src="https://github.com/user-attachments/assets/2b360ca8-866c-406f-a84f-a9b9fae72d90" />

**Panel administrativo**
 
Panel con métricas de usuarios activos, reportes y catálogos del sistema (categorías y razones).
 
<img width="1365" height="767" alt="Captura de pantalla 2026-06-17 153331" src="https://github.com/user-attachments/assets/c94fb1fb-ebb8-42f2-baa1-94c7f87adbd4" />
 
**Accesos administrativos**
 
Accesos directos a los módulos de gestión administrativa: usuarios, tipos de reporte, localizaciones y especializaciones.
 
<img width="1365" height="264" alt="image" src="https://github.com/user-attachments/assets/df491add-ff38-4a94-a922-b021f12c711f" />
 
## Tecnologías principales
 
- **React 19:** construcción de la interfaz mediante componentes.
- **Vite:** entorno de desarrollo y empaquetado de la aplicación.
- **React Router:** navegación y protección de rutas.
- **Supabase:** autenticación, base de datos, almacenamiento de imágenes y funciones del backend.
- **Tailwind CSS:** estilos y diseño visual.
- **Chart.js:** gráficos de los paneles de control.
- **Radix UI y shadcn:** componentes reutilizables de interfaz.
## Arquitectura base
 
El proyecto utiliza una **arquitectura modular por funcionalidades**, complementada con una separación por capas. Cada módulo agrupa las páginas, componentes, hooks, contextos y utilidades relacionados con una función específica del sistema.
 
La arquitectura se divide principalmente en:
 
1. **Capa de presentación:** páginas, componentes visuales y formularios.
2. **Capa de estado y lógica de interfaz:** contextos y hooks que coordinan el estado y las acciones de cada módulo.
3. **Capa de servicios:** comunica la aplicación con Supabase y concentra las operaciones externas.
4. **Capa de infraestructura compartida:** enrutamiento, autenticación, layouts, constantes, componentes comunes y proveedores globales.
### Flujo general
 
```text
Usuario
  |
  v
Página o componente
  |
  v
Hook o contexto
  |
  v
Servicio
  |
  v
Supabase
  |- Autenticación
  |- Base de datos
  |- Storage
  `- Edge Functions
```
 
Este flujo evita que los componentes visuales dependan directamente de la implementación del backend y facilita el mantenimiento de cada funcionalidad.
 
## Estructura principal
 
```text
CLEAN-VALLE-SOFTWARE-1/
|-- public/                         # Recursos públicos
|-- src/
|   |-- core/                       # Infraestructura y elementos compartidos
|   |   |-- components/             # Componentes reutilizables
|   |   |-- constants/              # Constantes globales y del dominio
|   |   |-- context/                # Contextos globales
|   |   |-- layouts/                # Estructuras visuales generales
|   |   |-- lib/                    # Funciones auxiliares
|   |   |-- mappers/                # Transformación de datos
|   |   |-- providers/              # Proveedores globales
|   |   |-- router/                 # Rutas y control de acceso
|   |   |-- services/               # Servicios transversales de la interfaz
|   |   `-- styles/                 # Estilos globales
|   |-- modules/                    # Funcionalidades del sistema
|   |-- services/                   # Comunicación con Supabase
|   |-- App.jsx                     # Componente raíz
|   `-- main.jsx                    # Punto de entrada
|-- supabase/
|   |-- functions/                  # Funciones ejecutadas en Supabase
|   `-- config.toml                 # Configuración local de Supabase
|-- database_documentation.md       # Documentación de la base de datos
|-- vite.config.js                  # Configuración de Vite
`-- package.json                    # Dependencias y comandos del proyecto
```
 
## Elementos de `core`
 
La carpeta `src/core` contiene los recursos utilizados por varios módulos:
 
- **components:** campos, botones, tarjetas, alertas, gráficos y otros componentes reutilizables.
- **constants:** rutas, roles, mensajes, configuración de navegación y valores del dominio.
- **context:** estado global de autenticación.
- **layouts:** barra de navegación y estructura principal de las páginas privadas.
- **providers:** integra autenticación, alertas, notificaciones, reportes y enrutamiento.
- **router:** define rutas públicas, privadas y restricciones por rol.
- **mappers:** adapta los datos recibidos para su uso en la interfaz.
- **lib:** utilidades generales.
- **services:** manejo compartido de alertas y mensajes de error.
- **styles:** estilos globales de la aplicación.
## Módulos funcionales
 
Los módulos se encuentran en `src/modules` y están separados según su responsabilidad:
 
| Módulo | Responsabilidad |
|---|---|
| `landing` | Presenta la página pública inicial y la información general de CleanValle. |
| `auth` | Gestiona el inicio de sesión, recuperación de contraseña y activación de cuentas invitadas. |
| `security` | Permite cambiar la contraseña de un usuario autenticado. |
| `profile` | Muestra y permite gestionar la información del perfil del usuario. |
| `reports` | Permite crear reportes, consultar reportes propios y visualizar reportes resueltos. |
| `notifications` | Administra la visualización y lectura de notificaciones. |
| `operator` | Gestiona las asignaciones del operador y el registro de resoluciones. |
| `manager-reports` | Permite revisar, agrupar, asignar y dar seguimiento a reportes y resoluciones. |
| `dashboard-manager` | Presenta el panel principal del gestor. |
| `dashboard-admin` | Presenta métricas y accesos administrativos. |
| `users-admin` | Gestiona la creación, edición y activación de usuarios. |
| `report-types-admin` | Administra categorías, tipos y subtipos de reporte. |
| `locations-admin` | Administra localizaciones y subáreas utilizadas en los reportes. |
| `specializations-admin` | Administra las especializaciones asociadas con operadores y categorías. |
| `gestor` | Estructura reservada para funcionalidades del rol gestor; las funciones activas se encuentran actualmente en `manager-reports` y `dashboard-manager`. |
 
### Estructura interna de un módulo
 
Dependiendo de su complejidad, un módulo puede contener:
 
```text
modulo/
|-- components/     # Componentes propios de la funcionalidad
|-- pages/          # Vistas asociadas con rutas
|-- hooks/          # Lógica reutilizable de React
|-- context/        # Estado compartido dentro del módulo
|-- services/       # Servicios locales, si fueran necesarios
|-- data/           # Repositorios o adaptadores de datos
|-- constants/      # Valores fijos del módulo
`-- utils/          # Validaciones y funciones auxiliares
```
 
No todos los módulos necesitan todas estas carpetas. La estructura se adapta a las necesidades de cada funcionalidad.
 
## Enrutamiento y seguridad
 
Las rutas se centralizan en `src/core/router/AppRouter.jsx`. El sistema maneja tres tipos principales de acceso:
 
- **Rutas públicas:** página inicial, inicio de sesión y consulta pública de reportes resueltos.
- **Rutas para invitados:** pantallas que solo deben mostrarse cuando no existe una sesión activa.
- **Rutas privadas:** requieren autenticación y utilizan el layout principal.
`PrivateRoute` valida la sesión y, cuando corresponde, comprueba que el usuario tenga uno de los roles autorizados. Si el usuario no tiene acceso, es redirigido a una página permitida.
 
## Estado global
 
`AppProviders` agrupa los proveedores generales de la aplicación:
 
- **AlertProvider:** muestra mensajes de éxito, advertencia y error.
- **BrowserRouter:** habilita la navegación.
- **AuthProvider:** conserva la sesión y los datos del usuario autenticado.
- **NotificationProvider:** administra notificaciones.
- **ReportsProvider:** comparte información relacionada con reportes.
Los contextos específicos de administración se cargan solamente en las rutas que los necesitan.
 
## Capa de servicios
 
La carpeta `src/services` concentra la comunicación con Supabase. Su responsabilidad es ejecutar consultas, autenticación, almacenamiento y operaciones del negocio, entregando a la interfaz datos listos para utilizar.
 
| Servicio | Función |
|---|---|
| `supabaseClient.js` | Configura y exporta el cliente de Supabase. |
| `authService.js` | Gestiona inicio de sesión, cierre de sesión y datos de autenticación. |
| `passwordRecoveryService.js` | Gestiona la recuperación y actualización de contraseñas. |
| `userInvitationService.js` | Valida invitaciones y permite establecer la contraseña inicial. |
| `reportService.js` | Crea reportes y consulta reportes propios o resueltos. |
| `reportCatalogService.js` | Obtiene y almacena temporalmente los catálogos usados por los reportes. |
| `reportStorageService.js` | Sube fotografías y genera enlaces para visualizar archivos. |
| `notificationService.js` | Consulta, actualiza y escucha notificaciones. |
| `operatorReportService.js` | Gestiona asignaciones y resoluciones del operador. |
| `managerReportService.js` | Gestiona revisión, asignación y agrupación de reportes. |
| `adminDashboardService.js` | Obtiene los datos del panel administrativo. |
| `adminUserService.js` | Gestiona usuarios desde el módulo administrativo. |
| `adminReportTypeService.js` | Gestiona tipos y categorías de reporte. |
| `adminLocationService.js` | Gestiona localizaciones y subáreas. |
| `adminSpecializationService.js` | Gestiona especializaciones. |
 
En `src/core/services` se encuentran servicios transversales:
 
- `alertService.js`: publica alertas para la interfaz.
- `errorMessageService.js`: transforma errores técnicos en mensajes controlados para el usuario.
## Integración con Supabase
 
Supabase funciona como backend del proyecto y proporciona:
 
- Autenticación y persistencia de sesiones.
- Acceso a la base de datos.
- Procedimientos y consultas para las operaciones del negocio.
- Almacenamiento de fotografías de reportes y resoluciones.
- Notificaciones en tiempo real.
- Edge Function `admin-create-user` para la creación administrativa de usuarios.
Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` deben estar disponibles en el entorno para inicializar la conexión.
 
## Inicio de la aplicación
 
El arranque sigue este orden:
 
1. `main.jsx` monta la aplicación en el elemento `root`.
2. `App.jsx` incorpora los proveedores globales.
3. `AppRouter.jsx` selecciona la página según la URL.
4. Las rutas privadas validan la sesión y el rol.
5. La página utiliza hooks, contextos y servicios para ejecutar sus operaciones.
 
