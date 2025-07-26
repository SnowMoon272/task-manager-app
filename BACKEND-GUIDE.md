# 🔧 Guía Completa del Backend - Task Manager App

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Estructura de Archivos](#estructura-de-archivos)
3. [Modelos de Datos](#modelos-de-datos)
4. [Sistema de Autenticación](#sistema-de-autenticación)
5. [API Routes y Endpoints](#api-routes-y-endpoints)
6. [Middleware](#middleware)
7. [Validaciones](#validaciones)
8. [Flujo de Datos](#flujo-de-datos)
9. [Manejo de Errores](#manejo-de-errores)

---

## 🏗️ Arquitectura General

### Tecnologías Utilizadas

- **Express.js**: Framework web para Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM (Object Document Mapper) para MongoDB
- **JWT**: JSON Web Tokens para autenticación
- **bcryptjs**: Para encriptar contraseñas
- **TypeScript**: Para tipado estático

### Patrón MVC Simplificado

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Routes      │───▶│   Controllers   │───▶│     Models      │
│  (Rutas API)    │    │  (Lógica de     │    │ (Esquemas DB)   │
│                 │    │   Negocio)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       │                       │
         │                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Middleware    │    │   Responses     │    │    MongoDB      │
│ (Autenticación) │    │    (JSON)       │    │   (Documentos)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📁 Estructura de Archivos

```
server/
├── index.ts              # 🚀 Servidor principal
├── models/               # 📊 Modelos de datos
│   ├── User.ts          # 👤 Modelo de Usuario
│   └── Task.ts          # 📋 Modelo de Tarea
├── routes/              # 🛤️ Rutas de la API
│   ├── auth.ts          # 🔐 Rutas de autenticación
│   ├── tasks.ts         # 📝 Rutas de tareas
│   └── users.ts         # 👥 Rutas de usuarios
├── middleware/          # ⚙️ Middleware personalizado
│   └── auth.ts          # 🔒 Middleware de autenticación
└── controllers/         # 🎮 Controladores (futuro)
```

---

## 📊 Modelos de Datos

### 👤 Modelo Usuario (User.ts)

```typescript
interface IUser {
  email: string; // Email único del usuario
  password: string; // Contraseña encriptada
  name: string; // Nombre completo
  avatar?: string; // URL del avatar (opcional)
  role: "admin" | "user"; // Rol del usuario
}
```

**Características Importantes:**

- **Email único**: Previene duplicados con índice único
- **Contraseña encriptada**: Usa bcryptjs con 12 rounds de salt
- **Validaciones**: Email válido, contraseña mínimo 6 caracteres
- **Timestamps**: Automáticos (createdAt, updatedAt)

### 📋 Modelo Tarea (Task.ts)

```typescript
interface ITask {
  title: string; // Título de la tarea
  description?: string; // Descripción opcional
  status: "todo" | "in-progress" | "done"; // Estado de la tarea
  priority: "low" | "medium" | "high"; // Prioridad
  assignee?: ObjectId; // Usuario asignado (opcional)
  creator: ObjectId; // Usuario creador (requerido)
  subtasks: ISubtask[]; // Array de subtareas
  dueDate?: Date; // Fecha límite (opcional)
  tags: string[]; // Etiquetas
}

interface ISubtask {
  title: string; // Título de la subtarea
  completed: boolean; // Estado de completado
  createdAt: Date; // Fecha de creación
}
```

**Validaciones Especiales:**

- ✅ **Regla de Subtareas**: Una tarea NO puede marcarse como 'done' si tiene subtareas incompletas
- 🔗 **Referencias**: assignee y creator referencian al modelo User
- 📏 **Límites**: Título máximo 200 caracteres, descripción 1000
- 🏷️ **Tags**: Máximo 30 caracteres cada uno

---

## 🔐 Sistema de Autenticación

### Flujo de Registro

```
1. Usuario envía datos ───▶ 2. Validar email único
                          ▼
6. Retornar JWT + datos ◀─ 3. Encriptar contraseña
                          ▼
                          4. Guardar en DB
                          ▼
                          5. Generar JWT token
```

### Flujo de Login

```
1. Usuario envía credenciales ───▶ 2. Buscar por email
                                 ▼
5. Retornar JWT + datos ◀──────── 3. Comparar contraseñas
                                 ▼
                                 4. Generar JWT token
```

### JWT (JSON Web Tokens)

```typescript
// Payload del token
{
  userId: "string",      // ID del usuario
  email: "string",       // Email del usuario
  iat: number,           // Fecha de creación
  exp: number            // Fecha de expiración (7 días)
}
```

---

## 🛤️ API Routes y Endpoints

### 🔐 Autenticación (`/api/auth`)

```
POST /api/auth/register  # Registrar nuevo usuario
POST /api/auth/login     # Iniciar sesión
GET  /api/auth/me        # Obtener perfil actual
```

### 📝 Tareas (`/api/tasks`)

```
GET    /api/tasks              # Obtener todas las tareas
POST   /api/tasks              # Crear nueva tarea
GET    /api/tasks/:id          # Obtener tarea específica
PUT    /api/tasks/:id          # Actualizar tarea
DELETE /api/tasks/:id          # Eliminar tarea

POST   /api/tasks/:id/subtasks           # Añadir subtarea
PUT    /api/tasks/:id/subtasks/:subId    # Actualizar subtarea
DELETE /api/tasks/:id/subtasks/:subId    # Eliminar subtarea
```

### 👥 Usuarios (`/api/users`)

```
GET /api/users     # Obtener lista de usuarios
GET /api/users/:id # Obtener usuario específico
```

---

## ⚙️ Middleware

### 🔒 Middleware de Autenticación (auth.ts)

```typescript
const authenticateToken = (req, res, next) => {
  // 1. Extraer token del header Authorization
  const token = req.headers['authorization']?.split(' ')[1];

  // 2. Verificar que existe el token
  if (!token) return res.status(401).json({...});

  // 3. Verificar y decodificar el JWT
  const decoded = jwt.verify(token, JWT_SECRET);

  // 4. Añadir userId al request
  req.userId = decoded.userId;

  // 5. Continuar al siguiente middleware/controlador
  next();
};
```

**¿Cómo funciona?**

1. Cliente envía token en header: `Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`
2. Middleware extrae el token después de "Bearer "
3. Verifica la firma del JWT con la clave secreta
4. Si es válido, decodifica y extrae el userId
5. Añade userId al objeto request para usar en rutas

---

## ✅ Validaciones

### 🔒 Validación de Subtareas Completas

```typescript
// Middleware pre-save en Task.ts
TaskSchema.pre("save", function (next) {
  if (this.status === "done" && this.subtasks.length > 0) {
    const incompletas = this.subtasks.filter((sub) => !sub.completed);

    if (incompletas.length > 0) {
      return next(new Error(`No se puede completar: ${incompletas.length} subtareas pendientes`));
    }
  }
  next();
});
```

**¿Cuándo se ejecuta?**

- Antes de guardar una tarea (crear o actualizar)
- Antes de actualizaciones con `findOneAndUpdate`
- Automáticamente por Mongoose

### 🛡️ Validación de Permisos

```typescript
// En routes/tasks.ts
if (task.creator.toString() !== userId && task.assignee?.toString() !== userId) {
  return res.status(403).json({
    success: false,
    message: "No autorizado para modificar esta tarea",
  });
}
```

**Reglas de Permisos:**

- ✅ Creador puede: ver, editar, eliminar, gestionar subtareas
- ✅ Asignado puede: ver, editar, gestionar subtareas
- ❌ Otros usuarios: solo pueden ver si tienen acceso

---

## 🔄 Flujo de Datos

### Ejemplo: Crear una Tarea

```
1. Cliente POST /api/tasks
   {
     "title": "Implementar login",
     "description": "Crear formulario de login",
     "priority": "high"
   }
   ▼
2. Middleware de autenticación
   - Verifica JWT token
   - Extrae userId
   ▼
3. Controlador de tareas
   - Valida datos de entrada
   - Crea objeto Task con userId como creator
   ▼
4. Mongoose/MongoDB
   - Valida según esquema
   - Ejecuta middleware pre-save
   - Guarda en base de datos
   ▼
5. Respuesta al cliente
   {
     "success": true,
     "message": "Tarea creada exitosamente",
     "data": { "task": {...} }
   }
```

### Ejemplo: Intentar Completar Tarea con Subtareas Pendientes

```
1. Cliente PUT /api/tasks/123
   { "status": "done" }
   ▼
2. Middleware de autenticación ✅
   ▼
3. Buscar tarea y verificar permisos ✅
   ▼
4. Intentar actualizar con Mongoose
   ▼
5. Middleware pre-save detecta:
   - status = 'done'
   - subtasks.length > 0
   - Algunas subtareas incompletas
   ▼
6. Error de validación ❌
   {
     "success": false,
     "message": "No se puede completar: 2 subtareas pendientes",
     "code": "INCOMPLETE_SUBTASKS"
   }
```

---

## ⚠️ Manejo de Errores

### Tipos de Errores

```typescript
// 1. Errores de Validación (400)
{
  success: false,
  message: "No se puede completar: subtareas pendientes",
  code: "INCOMPLETE_SUBTASKS"
}

// 2. Errores de Autenticación (401)
{
  success: false,
  message: "Token de acceso requerido"
}

// 3. Errores de Autorización (403)
{
  success: false,
  message: "No autorizado para esta acción"
}

// 4. Errores de Recurso No Encontrado (404)
{
  success: false,
  message: "Tarea no encontrada"
}

// 5. Errores del Servidor (500)
{
  success: false,
  message: "Error interno del servidor"
}
```

### Middleware Global de Errores

```typescript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Algo salió mal!",
    error: process.env.NODE_ENV === "development" ? err.message : "Error interno",
  });
});
```

---

## 🔌 Conexión con MongoDB

### Configuración de Conexión

```typescript
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((error) => {
    console.error("❌ Error de conexión:", error);
    process.exit(1);
  });
```

### Esquema de Base de Datos

```
taskmanager (Database)
├── users (Collection)
│   ├── { _id, email, password, name, role, createdAt, updatedAt }
│   └── { _id, email, password, name, role, createdAt, updatedAt }
├── tasks (Collection)
│   ├── { _id, title, description, status, creator, assignee, subtasks[], ... }
│   └── { _id, title, description, status, creator, assignee, subtasks[], ... }
```

---

## 🚀 Ciclo de Vida de una Request

```
1. Cliente hace petición HTTP
   ▼
2. Express.js recibe la request
   ▼
3. Middleware de CORS, Helmet, Morgan
   ▼
4. Parse de JSON (express.json())
   ▼
5. Routing (/api/tasks, /api/auth, etc.)
   ▼
6. Middleware de autenticación (si aplica)
   ▼
7. Controlador de la ruta específica
   ▼
8. Interacción con MongoDB via Mongoose
   ▼
9. Middleware de validación (pre/post hooks)
   ▼
10. Respuesta JSON al cliente
```

---

## 🔧 Comandos de Desarrollo

```bash
# Iniciar servidor en desarrollo
npm run server

# Ver logs de MongoDB
tail -f /opt/homebrew/var/log/mongodb/mongo.log

# Conectar a MongoDB shell
mongo taskmanager

# Ver todas las tareas
db.tasks.find().pretty()

# Ver todos los usuarios
db.users.find().pretty()
```

---

## 📈 Próximas Mejoras

- [ ] Implementar rate limiting
- [ ] Añadir logs estructurados
- [ ] Implementar cache con Redis
- [ ] Añadir tests unitarios
- [ ] Implementar WebSockets para tiempo real
- [ ] Añadir documentación con Swagger
- [ ] Implementar backup automático

---

Esta arquitectura proporciona una base sólida y escalable para tu aplicación de gestión de tareas. ¿Hay algún aspecto específico que te gustaría que profundice más?

