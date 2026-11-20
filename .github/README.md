# LeadsFlow

> CRM sencillo para gestionar y hacer seguimiento de leads desde un solo lugar.

**Estado del proyecto:** 🔄 En desarrollo del MVP

---

## ¿Qué es LeadsFlow?

LeadsFlow es un CRM (Customer Relationship Management) minimalista orientado a freelancers, pequeñas agencias y emprendedores. Su propósito es centralizar la gestión de leads y clientes en una sola herramienta, sin la complejidad de plataformas más grandes.

El proyecto se encuentra actualmente en fase de diseño y planificación del MVP. El frontend no ha sido implementado; la etapa actual cubre la definición de flujos, arquitectura y modelo de datos.

---

## ¿Qué problema resuelve?

Freelancers y equipos pequeños suelen gestionar sus leads en hojas de cálculo, notas dispersas o herramientas genéricas que no están pensadas para este tipo de seguimiento. El resultado habitual es pérdida de contexto, seguimientos olvidados y oportunidades que se escapan.

LeadsFlow busca resolver eso con una herramienta directa y sin fricción, diseñada específicamente para este flujo de trabajo.

---

## Usuario objetivo

- Freelancers que atienden múltiples prospectos o clientes simultáneamente.
- Pequeñas agencias digitales o creativas.
- Emprendedores que necesitan organizar su pipeline comercial de forma simple.

---

## Estado actual del proyecto

| Etapa                              | Estado          |
| ---------------------------------- | --------------- |
| Definición del producto y flujo    | ✅ Completado   |
| Diseño del Dashboard V1            | ✅ Completado   |
| Diseño de vista individual de lead | ✅ Completado   |
| Modelo Entidad-Relación (ERD)      | ✅ Completado |
| Estructura de la base de datos     | ✅ Completado  |
| Definición del stack tecnológico   | ✅ Completado   |
| Implementación del frontend        | ⏳ Pendiente    |
| Implementación del backend         | ✅ Completado    |
| MVP funcional                      | ⏳ Pendiente    |

---

## Funcionalidades de LeadFlow

### Dashboard
- Saludo al administrador.
- Tabla/listado de leads con campos resumidos: ID, nombre, estado, servicio, próximo paso.
- Filtros aplicables sobre el listado.
- Acción para registrar un nuevo lead.

### Registro de leads
- Formulario base para capturar la información inicial de un lead.
- Almacenamiento y visualización inmediata en el listado al completar el formulario.

### Vista individual del lead
Cada lead tendrá una vista de detalle con los siguientes campos:

| Campo                   | Descripción                          |
| ----------------------- | ------------------------------------ |
| ID                      | Identificador único del lead         |
| Nombre                  | Nombre del prospecto o cliente       |
| Información de contacto | Email, teléfono u otros datos        |
| Empresa                 | Organización o negocio del lead      |
| Servicio                | Servicio de interés                  |
| Estado                  | Etapa actual en el pipeline          |
| Notas                   | Observaciones internas               |
| Próximo paso            | Acción pendiente definida            |
| Fecha de contrato       | Fecha acordada o de cierre           |

Acciones disponibles: **editar** y **eliminar**.

### Estados del pipeline

| Estado         |
| -------------- |
| Nuevo          |
| Pendiente      |
| En negociación |
| Ganado         |
| Perdido        |

### Sistema de usuarios (V1)
- Un único tipo de usuario: **Administrador**.
- El administrador tiene control total: crear, consultar, editar y eliminar leads (CRUD completo).
- No se contempla multirol ni gestión de permisos en esta versión.

---

## Roadmap

### Fase 1 — Planificación del MVP 
- [x] Definición del producto y flujo general
- [x] Diseño del Dashboard V1
- [x] Diseño de vista individual del lead
- [x] Modelo Entidad-Relación (ERD)
- [x] Estructura de la base de datos
- [x] Definición del stack tecnológico

### Fase 2 — Desarrollo del MVP
- [x] Estructura base del proyecto
- [x] Formulario de registro de leads
- [x] Dashboard con listado y filtros
- [x] Vista individual del lead
- [x] Operaciones CRUD completas
- [x] Validaciones y manejo de errores básico

### Fase 3 — Post-MVP *(en proceso)*
- [x] Sistema de autenticación y login
- [ ] Múltiples roles de usuario
- [ ] Historial de actividad por lead
- [x] Notificaciones y recordatorios
- [ ] Exportación de datos
- [ ] Integraciones externas

---

## Planificación técnica

> El stack utilizado para este MVP es :
> HTML
> CSS
> JavaScript
> Supabase

### Arquitectura general prevista

El sistema seguirá una arquitectura estándar de aplicación web:

```
Frontend  →  Backend / API  →  Base de datos
```

- **Frontend:** interfaz de usuario para gestión de leads. *[Stack por definir]*
- **Backend:** lógica de negocio y exposición de datos. *JavaScript*
- **Base de datos:** almacenamiento relacional. *JavaScript, Supabase*

### Flujo general del sistema

```
Formulario de registro
        ↓
   Listado / Dashboard
        ↓
  Vista individual del lead
        ↓
  Edición / Eliminación
```

---

## Estructura del proyecto

```
leadsflow/
├── css/            # Estilos y frontend
├── docs/           # Documentación técnica, de producto, manuales.
├── js/             # logica, auth, animaciones. 
├── design/         # Wireframes y archivos de diseño
└── README.md
```

---

## Desarrollo

Este proyecto sigue un flujo de trabajo con **daily commits** en GitHub para documentar el avance progresivo del desarrollo. Las decisiones relevantes de producto, diseño y arquitectura se registran en la carpeta `docs/`.

El objetivo es que el repositorio refleje no solo el código final, sino el proceso de construcción detrás del producto.

---

## Herramientas de desarrollo

| Herramienta  | Uso                  |
| ------------ | -------------------- |
| Git / GitHub | Control de versiones |
| VS Code      | Editor de código     |

---

*LeadsFlow — Proyecto en desarrollo activo.*
