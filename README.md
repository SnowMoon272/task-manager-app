# Task Manager App 📋

Una aplicación moderna de gestión de tareas con tablero Kanban, construida con Next.js, Express.js, MongoDB y TypeScript.

## 🚀 Características

- **Frontend moderno**: Next.js 15 con App Router y TypeScript
- **Backend robusto**: Express.js con autenticación JWT
- **Base de datos**: MongoDB con Mongoose ODM
- **Interfaz atractiva**: Tailwind CSS para un diseño responsive
- **Autenticación segura**: Sistema de login/registro con JWT
- **Gestión de tareas**: CRUD completo con diferentes estados
- **Subtareas**: Soporte para tareas anidadas
- **Estados de tareas**: Todo, En Progreso, Completado
- **Prioridades**: Baja, Media, Alta

## 📂 Estructura del Proyecto

```
task-manager-app/
├── src/                          # Frontend Next.js
│   ├── app/                      # App Router de Next.js
│   │   ├── api/                  # API Routes (proxy al backend)
│   │   └── page.tsx              # Página principal
│   ├── components/               # Componentes React
│   │   └── auth/                 # Componentes de autenticación
│   └── hooks/                    # Hooks personalizados
├── server/                       # Backend Express.js
│   ├── models/                   # Modelos de MongoDB
│   ├── routes/                   # Rutas de la API
│   ├── middleware/               # Middleware de Express
│   ├── controllers/              # Controladores (futuro)
│   └── index.ts                  # Servidor principal
├── .env                          # Variables de entorno
└── package.json                  # Dependencias y scripts
```

## 🛠️ Tecnologías

### Frontend

- **Next.js 15**: Framework de React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de estilos
- **React Hooks**: Gestión de estado

### Backend

- **Express.js**: Framework web para Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **JWT**: Autenticación basada en tokens
- **bcryptjs**: Encriptación de contraseñas

## 📋 Prerequisitos

- Node.js 18+ y npm
- MongoDB instalado y ejecutándose
- Puerto 3000 (frontend) y 5000 (backend) disponibles

## 🚀 Instalación y Configuración

1. **Clonar el repositorio**

   ```bash
   cd task-manager-app
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Iniciar MongoDB**

   ```bash
   # macOS con Homebrew
   brew services start mongodb-community

   # O ejecutar directamente
   mongod
   ```

5. **Ejecutar la aplicación**

   ```bash
   # Opción 1: Ejecutar frontend y backend por separado
   npm run server    # Terminal 1 (Backend en puerto 5000)
   npm run dev       # Terminal 2 (Frontend en puerto 3000)

   # Opción 2: Ejecutar ambos simultáneamente
   npm run dev:full
   ```

6. **Abrir la aplicación**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia el frontend Next.js en modo desarrollo
- `npm run server` - Inicia el servidor Express.js en modo desarrollo
- `npm run dev:full` - Inicia frontend y backend simultáneamente
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## 🗃️ Modelos de Datos

### Usuario (User)

```typescript
{
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
}
```

### Tarea (Task)

```typescript
{
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: ObjectId;
  creator: ObjectId;
  subtasks: Subtask[];
  dueDate?: Date;
  tags: string[];
}
```

### Subtarea (Subtask)

```typescript
{
  title: string;
  completed: boolean;
  createdAt: Date;
}
```

## 🔌 Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Tareas

- `GET /api/tasks` - Obtener todas las tareas
- `POST /api/tasks` - Crear nueva tarea
- `GET /api/tasks/:id` - Obtener tarea específica
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Subtareas

- `POST /api/tasks/:id/subtasks` - Añadir subtarea
- `PUT /api/tasks/:id/subtasks/:subtaskId` - Actualizar subtarea
- `DELETE /api/tasks/:id/subtasks/:subtaskId` - Eliminar subtarea

### Usuarios

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario específico

## 🔐 Autenticación

La aplicación utiliza JWT (JSON Web Tokens) para la autenticación:

1. El usuario se registra o inicia sesión
2. El servidor genera un JWT token
3. El token se almacena en localStorage del navegador
4. Todas las peticiones autenticadas incluyen el token en el header Authorization

## 🎨 Próximas Características

- [ ] Tablero Kanban con drag & drop
- [ ] Filtros y búsqueda de tareas
- [ ] Notificaciones en tiempo real
- [ ] Colaboración en equipo
- [ ] Comentarios en tareas
- [ ] Archivos adjuntos
- [ ] Dashboard con métricas
- [ ] Modo oscuro
- [ ] Exportación de datos

## 🐛 Solución de Problemas

### Error de conexión a MongoDB

```bash
# Verificar que MongoDB esté ejecutándose
brew services list | grep mongodb

# Iniciar MongoDB si no está ejecutándose
brew services start mongodb-community
```

### Puerto en uso

```bash
# Verificar qué proceso usa el puerto
lsof -i :3000  # o :5000

# Terminar el proceso
kill -9 <PID>
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

Desarrollado con ❤️ usando Next.js, Express.js y MongoDB

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

