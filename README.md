# Task Manager App ✨

Una aplicación completa de gestión de tareas con tablero Kanban interactivo, construida con las tecnologías más modernas para ofrecer una experiencia de usuario excepcional.

## 🚀 Características Principales

### 🎯 Gestión de Tareas Completa

- **Tablero Kanban interactivo** con drag & drop usando `@dnd-kit`
- **Estados de tareas**: Pendientes, En Progreso, Completadas
- **Prioridades**: Baja, Media, Alta con indicadores visuales
- **Subtareas** con seguimiento de progreso individual
- **Comentarios** en cada tarea para colaboración

### 🎨 Interfaz Moderna y Atractiva

- **Diseño espacial** con animaciones y efectos de estrellas
- **UI responsive** optimizada para todos los dispositivos
- **Tema oscuro** con gradientes y efectos glassmorphism
- **Componentes reutilizables** construidos con Tailwind CSS
- **Iconografía consistente** usando Heroicons

### 🔐 Autenticación y Seguridad

- **Sistema JWT robusto** con tokens seguros
- **Validación de formularios** con React Hook Form y Zod
- **Encriptación de contraseñas** con bcryptjs
- **Gestión de estado global** con Zustand

### 🏗️ Arquitectura Técnica

- **Frontend**: Next.js 15 con App Router y TypeScript
- **Backend**: Express.js con arquitectura MVC
- **Base de datos**: MongoDB con Mongoose ODM
- **Validaciones**: Zod para validación de esquemas
- **Estado global**: Zustand para gestión de estado reactiva

## 📂 Arquitectura del Proyecto

```
task-manager-app/
├── 🎨 Frontend (Next.js 15 + TypeScript)
│   ├── src/app/                    # App Router de Next.js
│   │   ├── page.tsx               # Landing page con diseño espacial
│   │   ├── dashboard/             # Panel principal de tareas
│   │   ├── login/                 # Autenticación de usuarios
│   │   ├── register/              # Registro de nuevos usuarios
│   │   ├── profile/               # Gestión de perfil de usuario
│   │   └── api/                   # API Routes (proxy al backend)
│   ├── src/components/            # Componentes React reutilizables
│   │   ├── auth/                  # Componentes de autenticación
│   │   ├── dashboard/             # Componentes del panel principal
│   │   ├── tasks/                 # Componentes del tablero Kanban
│   │   ├── profile/               # Componentes de gestión de perfil
│   │   ├── guards/                # Protección de rutas
│   │   ├── home/                  # Componentes de la landing page
│   │   ├── providers/             # Proveedores de contexto
│   │   └── ui/                    # Componentes UI base
│   ├── src/store/                 # Gestión de estado global (Zustand)
│   │   ├── auth.ts               # Estado de autenticación
│   │   └── tasks.ts              # Estado de tareas
│   ├── src/services/             # Servicios y utilidades
│   │   └── api.ts               # Cliente API centralizado
│   └── src/types/               # Definiciones de tipos TypeScript
├── 🔧 Backend (Express.js + TypeScript)
│   ├── server/index.ts           # Servidor principal con configuración
│   ├── server/models/            # Modelos de MongoDB con Mongoose
│   │   ├── User.ts              # Esquema de usuarios
│   │   └── Task.ts              # Esquema de tareas con subtareas
│   ├── server/routes/           # Rutas de la API REST
│   │   ├── auth.ts             # Endpoints de autenticación
│   │   ├── tasks.ts            # CRUD completo de tareas
│   │   └── users.ts            # Gestión de usuarios
│   ├── server/middleware/       # Middleware personalizado
│   │   └── auth.ts             # Verificación de JWT
│   └── server/controllers/      # Controladores (estructura futura)
├── 📄 Configuración
│   ├── .env                     # Variables de entorno
│   ├── package.json            # Dependencias y scripts
│   ├── tsconfig.json           # Configuración de TypeScript
│   ├── tailwind.config.ts      # Configuración de Tailwind CSS
│   ├── next.config.ts          # Configuración de Next.js
│   └── eslint.config.mjs       # Configuración de ESLint
└── 📚 Documentación
    ├── README.md               # Este archivo
    ├── BACKEND-GUIDE.md       # Guía detallada del backend
    └── DEVELOPMENT.md         # Guía de desarrollo
```

## 🛠️ Stack Tecnológico

### Frontend Moderno

- **[Next.js 15](https://nextjs.org/)** - Framework React con App Router y SSR
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para mayor robustez
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de utilidades CSS
- **[React Hook Form](https://react-hook-form.com/)** - Gestión eficiente de formularios
- **[Zod](https://zod.dev/)** - Validación de esquemas TypeScript-first
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gestión de estado global ligera
- **[@dnd-kit](https://dndkit.com/)** - Librería moderna de drag & drop
- **[Heroicons](https://heroicons.com/)** - Iconografía SVG optimizada

### Backend Robusto

- **[Express.js](https://expressjs.com/)** - Framework web minimalista para Node.js
- **[MongoDB](https://www.mongodb.com/)** - Base de datos NoSQL escalable
- **[Mongoose](https://mongoosejs.com/)** - ODM elegante para MongoDB
- **[JSON Web Tokens](https://jwt.io/)** - Autenticación stateless segura
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Hashing de contraseñas
- **[Helmet](https://helmetjs.github.io/)** - Middleware de seguridad
- **[CORS](https://github.com/expressjs/cors)** - Configuración de CORS
- **[Morgan](https://github.com/expressjs/morgan)** - Logger de peticiones HTTP

### Herramientas de Desarrollo

- **[ESLint](https://eslint.org/)** - Linting de código JavaScript/TypeScript
- **[TSX](https://github.com/esbuild-kit/tsx)** - Ejecución de TypeScript en desarrollo
- **[Turbopack](https://turbo.build/pack)** - Bundler ultra-rápido (modo dev)

## 📋 Requisitos del Sistema

### Entorno de Desarrollo

- **Node.js** v18.0+ con soporte para ES modules
- **npm** v8+ para gestión de dependencias
- **MongoDB** v5.0+ (local o MongoDB Atlas)
- **Git** para control de versiones

### Puertos Necesarios

- **Frontend**: Puerto 3000 (Next.js development server)
- **Backend**: Puerto 5001 (Express.js API server)
- **MongoDB**: Puerto 27017 (instancia local por defecto)

### Navegadores Soportados

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd task-manager-app
```

### 2. Instalar Dependencias

```bash
# Instalar todas las dependencias (frontend y backend)
npm install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar las variables según tu entorno
nano .env
```

**Variables importantes a configurar:**

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taskmanager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-to-T1-Prueba-Tecnica

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://localhost:5001
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
NEXT_PUBLIC_API_URL=http://localhost:5001

# Database Name
DB_NAME=taskmanager
```

### 4. Configurar MongoDB

#### Opción A: MongoDB Local (macOS)

```bash
# Instalar MongoDB con Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Iniciar el servicio
brew services start mongodb-community

# Verificar que esté ejecutándose
brew services list | grep mongodb
```

#### Opción B: MongoDB Atlas (Cloud)

1. Crear cuenta en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crear un cluster gratuito
3. Obtener la string de conexión
4. Actualizar `MONGODB_URI` en `.env`

### 5. Ejecutar la Aplicación

#### Desarrollo Completo (Recomendado)

```bash
# Ejecutar frontend y backend simultáneamente
npm run dev:full
```

#### Desarrollo por Separado

```bash
# Terminal 1: Backend (Puerto 5001)
npm run server

# Terminal 2: Frontend (Puerto 3000)
npm run dev
```

### 6. Verificar la Instalación

- **Frontend**: Visitar [http://localhost:3000](http://localhost:3000)
- **Backend API**: Visitar [http://localhost:5001](http://localhost:5001)
- **Health Check**: GET [http://localhost:5001/api/health](http://localhost:5001/api/health)

## 🔧 Comandos Disponibles

### Desarrollo

```bash
npm run dev          # Inicia Next.js en modo desarrollo (puerto 3000)
npm run server       # Inicia Express.js en modo desarrollo (puerto 5001)
npm run dev:full     # Ejecuta frontend y backend simultáneamente
```

### Producción

```bash
npm run build        # Construye la aplicación para producción
npm run start        # Inicia la aplicación en modo producción
npm run server:build # Compila el servidor TypeScript
```

### Calidad de Código

```bash
npm run lint         # Ejecuta ESLint para encontrar problemas
npm run lint:fix     # Ejecuta ESLint y corrige problemas automáticamente
```

### Utilidades de Base de Datos

```bash
# Conectar a MongoDB local
mongosh

# Verificar conexión desde la aplicación
curl http://localhost:5001/api/health
```

## 🗃️ Modelos de Datos

### 👤 Usuario (User)

```typescript
interface User {
  _id: string;
  name: string; // Nombre completo del usuario
  email: string; // Email único para autenticación
  password: string; // Contraseña encriptada con bcryptjs
  role: "admin" | "user"; // Rol de autorización
  avatar?: string; // URL de imagen de perfil (opcional)
  createdAt: Date; // Fecha de registro
  updatedAt: Date; // Última actualización
}
```

### 📋 Tarea (Task)

```typescript
interface Task {
  _id: string;
  title: string; // Título descriptivo de la tarea
  description?: string; // Descripción detallada (opcional)
  status: "todo" | "in-progress" | "done"; // Estado actual de la tarea
  priority: "low" | "medium" | "high"; // Nivel de prioridad
  assignee?: User; // Usuario asignado (opcional)
  creator: User; // Usuario que creó la tarea
  dueDate?: Date; // Fecha límite (opcional)
  tags: string[]; // Etiquetas para organización
  subtasks: Subtask[]; // Lista de subtareas
  comments: Comment[]; // Comentarios de colaboración
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Última modificación
}
```

### 📝 Subtarea (Subtask)

```typescript
interface Subtask {
  _id: string;
  title: string; // Descripción de la subtarea
  completed: boolean; // Estado de completado
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Última actualización
}
```

### 💬 Comentario (Comment)

```typescript
interface Comment {
  _id: string;
  text: string; // Contenido del comentario
  author: User; // Usuario que escribió el comentario
  createdAt: Date; // Fecha de creación
  updatedAt: Date; // Última edición
}
```

## 🔌 API Reference

### 🔐 Autenticación

| Método | Endpoint                    | Descripción                 | Body                               |
| ------ | --------------------------- | --------------------------- | ---------------------------------- |
| `POST` | `/api/auth/register`        | Registrar nuevo usuario     | `{ name, email, password }`        |
| `POST` | `/api/auth/login`           | Iniciar sesión              | `{ email, password }`              |
| `GET`  | `/api/auth/me`              | Obtener usuario autenticado | -                                  |
| `POST` | `/api/auth/change-password` | Cambiar contraseña          | `{ currentPassword, newPassword }` |

### 📋 Gestión de Tareas

| Método   | Endpoint         | Descripción              | Parámetros                                                  |
| -------- | ---------------- | ------------------------ | ----------------------------------------------------------- |
| `GET`    | `/api/tasks`     | Listar todas las tareas  | `?status=todo&priority=high&assignee=userId`                |
| `POST`   | `/api/tasks`     | Crear nueva tarea        | `{ title, description, priority, assignee, dueDate, tags }` |
| `GET`    | `/api/tasks/:id` | Obtener tarea específica | -                                                           |
| `PUT`    | `/api/tasks/:id` | Actualizar tarea         | `{ title?, description?, status?, priority?, ... }`         |
| `DELETE` | `/api/tasks/:id` | Eliminar tarea           | -                                                           |

### 📝 Subtareas

| Método   | Endpoint                             | Descripción         | Body                     |
| -------- | ------------------------------------ | ------------------- | ------------------------ |
| `POST`   | `/api/tasks/:id/subtasks`            | Añadir subtarea     | `{ title }`              |
| `PUT`    | `/api/tasks/:id/subtasks/:subtaskId` | Actualizar subtarea | `{ title?, completed? }` |
| `DELETE` | `/api/tasks/:id/subtasks/:subtaskId` | Eliminar subtarea   | -                        |

### 💬 Comentarios

| Método   | Endpoint                             | Descripción         | Body       |
| -------- | ------------------------------------ | ------------------- | ---------- |
| `POST`   | `/api/tasks/:id/comments`            | Añadir comentario   | `{ text }` |
| `PUT`    | `/api/tasks/:id/comments/:commentId` | Editar comentario   | `{ text }` |
| `DELETE` | `/api/tasks/:id/comments/:commentId` | Eliminar comentario | -          |

### 👥 Usuarios

| Método | Endpoint         | Descripción                | Parámetros                   |
| ------ | ---------------- | -------------------------- | ---------------------------- |
| `GET`  | `/api/users`     | Listar usuarios            | `?role=admin`                |
| `GET`  | `/api/users/:id` | Obtener usuario específico | -                            |
| `PUT`  | `/api/users/:id` | Actualizar perfil          | `{ name?, email?, avatar? }` |

### 📊 Estadísticas y Salud

| Método | Endpoint      | Descripción            | Respuesta                                    |
| ------ | ------------- | ---------------------- | -------------------------------------------- |
| `GET`  | `/api/health` | Estado del servidor    | `{ status: "ok", timestamp, version }`       |
| `GET`  | `/api/stats`  | Estadísticas de tareas | `{ totalTasks, completed, inProgress, ... }` |

## 🎯 Funcionalidades Implementadas

### ✅ Autenticación y Autorización

- [x] **Registro de usuarios** con validación de email único
- [x] **Login seguro** con JWT tokens
- [x] **Middleware de autenticación** protegiendo rutas sensibles
- [x] **Gestión de sesiones** persistente en el navegador
- [x] **Cambio de contraseña** con validación de contraseña actual
- [x] **Protección de rutas** con guards de autenticación

### ✅ Gestión de Tareas

- [x] **CRUD completo** de tareas (Crear, Leer, Actualizar, Eliminar)
- [x] **Tablero Kanban** con tres columnas (Pendientes, En Progreso, Completadas)
- [x] **Drag & Drop** interactivo para cambiar estados de tareas
- [x] **Sistema de prioridades** (Baja, Media, Alta) con indicadores visuales
- [x] **Asignación de tareas** a usuarios específicos
- [x] **Fechas límite** con indicadores de vencimiento
- [x] **Sistema de etiquetas** para organización
- [x] **Filtrado y búsqueda** por estado, prioridad y asignado

### ✅ Subtareas y Comentarios

- [x] **Subtareas anidadas** con seguimiento individual
- [x] **Progreso visual** basado en subtareas completadas
- [x] **Sistema de comentarios** para colaboración
- [x] **Timestamps** automáticos en todas las entidades

### ✅ Interfaz de Usuario

- [x] **Diseño responsive** optimizado para móviles y desktop
- [x] **Tema espacial** con animaciones y efectos visuales
- [x] **Landing page** atractiva con secciones informativas
- [x] **Dashboard completo** con estadísticas y métricas
- [x] **Modales interactivos** para creación y edición
- [x] **Formularios validados** con feedback en tiempo real
- [x] **Loading states** y manejo de errores elegante

### ✅ Gestión de Estado

- [x] **Estado global** con Zustand para auth y tareas
- [x] **Sincronización automática** entre cliente y servidor
- [x] **Optimistic updates** para mejor UX
- [x] **Caché inteligente** de datos frecuentemente usados

### ✅ Seguridad y Validación

- [x] **Validación de esquemas** con Zod tanto en frontend como backend
- [x] **Sanitización de datos** para prevenir inyecciones
- [x] **Headers de seguridad** con Helmet.js
- [x] **Rate limiting** básico en endpoints críticos
- [x] **CORS configurado** para desarrollo y producción

## 📖 Guía de Uso

### 🚪 Primeros Pasos

1. **Registro**: Accede a la aplicación y crea una cuenta nueva
2. **Login**: Inicia sesión con tus credenciales
3. **Dashboard**: Serás redirigido al panel principal de tareas

### 📋 Gestión de Tareas

#### Crear una Nueva Tarea

1. Click en el botón **"+ Nueva Tarea"** en el dashboard
2. Completa el formulario:
   - **Título**: Nombre descriptivo de la tarea
   - **Descripción**: Detalles adicionales (opcional)
   - **Prioridad**: Selecciona entre Baja, Media o Alta
   - **Asignado**: Elige un usuario responsable (opcional)
   - **Fecha límite**: Establece una fecha de vencimiento (opcional)
   - **Etiquetas**: Añade palabras clave para organización
3. Click en **"Crear Tarea"** para guardar

#### Organizar con el Tablero Kanban

- **Pendientes**: Tareas nuevas o no iniciadas
- **En Progreso**: Tareas que se están trabajando actualmente
- **Completadas**: Tareas finalizadas

**Cambiar Estados:**

- Arrastra y suelta las tareas entre columnas
- O usa el menú de acciones en cada tarjeta

#### Trabajar con Subtareas

1. Click en una tarea para abrir los detalles
2. En la sección **"Subtareas"**:
   - Añade nuevas subtareas con el botón **"+ Añadir"**
   - Marca como completadas haciendo click en el checkbox
   - Edita o elimina subtareas existentes
3. El progreso se actualiza automáticamente en la tarjeta principal

#### Sistema de Comentarios

1. Abre los detalles de cualquier tarea
2. En la sección **"Comentarios"**:
   - Escribe tu comentario en el campo de texto
   - Click **"Añadir Comentario"** para publicar
   - Los comentarios aparecen con timestamp y autor

### 👤 Gestión de Perfil

#### Actualizar Información Personal

1. Click en tu avatar en la esquina superior derecha
2. Selecciona **"Perfil"** del menú dropdown
3. Modifica los campos disponibles:
   - Nombre completo
   - Email
   - Avatar (URL de imagen)
4. Guarda los cambios

#### Cambiar Contraseña

1. En la página de perfil, click **"Cambiar Contraseña"**
2. Proporciona:
   - Contraseña actual
   - Nueva contraseña
   - Confirmación de nueva contraseña
3. La contraseña debe tener al menos 6 caracteres

### 🔍 Filtros y Búsqueda

En el dashboard puedes filtrar tareas por:

- **Estado**: Pendientes, En Progreso, Completadas
- **Prioridad**: Baja, Media, Alta
- **Asignado**: Tareas asignadas a usuarios específicos
- **Texto**: Búsqueda en títulos y descripciones

### 📊 Estadísticas

El dashboard muestra métricas útiles:

- **Total de tareas** en el sistema
- **Tareas completadas** vs pendientes
- **Distribución por prioridad**
- **Progreso general** del equipo

## 🐛 Solución de Problemas

### ❌ Errores Comunes

#### Error de Conexión a MongoDB

```bash
# Síntomas: "MongoServerError: connect ECONNREFUSED"
# Solución: Verificar que MongoDB esté ejecutándose

# Verificar estado del servicio
brew services list | grep mongodb

# Iniciar MongoDB si no está activo
brew services start mongodb-community

# Verificar conexión manual
mongosh mongodb://localhost:27017/taskmanager
```

#### Puerto en Uso

```bash
# Síntomas: "Error: listen EADDRINUSE :::3000"
# Solución: Liberar el puerto ocupado

# Encontrar el proceso que usa el puerto
lsof -ti:3000  # Para el frontend
lsof -ti:5001  # Para el backend

# Terminar el proceso
kill -9 <PID>

# O cambiar el puerto en .env
PORT=5002
```

#### Problemas de Autenticación JWT

```bash
# Síntomas: "401 Unauthorized" o "Invalid token"
# Solución: Verificar configuración JWT

# 1. Verificar que JWT_SECRET esté configurado en .env
echo $JWT_SECRET

# 2. Limpiar localStorage del navegador
localStorage.clear()

# 3. Verificar que el token no haya expirado
# (Los tokens expiran en 24h por defecto)
```

#### Errores de TypeScript

```bash
# Síntomas: Errores de tipos en desarrollo
# Solución: Regenerar tipos y limpiar cache

# Limpiar cache de Next.js
rm -rf .next

# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versión de TypeScript
npx tsc --version
```

### 🔧 Comandos de Depuración

```bash
# Verificar logs del servidor
npm run server -- --verbose

# Verificar conexión a la base de datos
curl http://localhost:5001/api/health

# Verificar variables de entorno
node -e "console.log(process.env.MONGODB_URI)"

# Logs detallados en desarrollo
DEBUG=* npm run server
```

## �📄 Licencia

Este proyecto está bajo la **Licencia MIT** - ver el archivo [LICENSE](LICENSE) para detalles.

---

<div align="center">

**Desarrollado con ❤️ usando Next.js, Express.js y MongoDB**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)

[📊 Dashboard](http://localhost:3000/dashboard) • [📚 Documentación](./BACKEND-GUIDE.md) • [🐛 Reportar Bug](../../issues) • [💡 Sugerir Feature](../../issues)

</div>

