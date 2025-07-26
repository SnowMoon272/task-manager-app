# Guía de Desarrollo - Task Manager App

## Primeros Pasos para Desarrollo

### 1. Verificar Prerequisites

```bash
# Verificar Node.js
node --version  # Debe ser 18+

# Verificar npm
npm --version

# Verificar MongoDB (debe estar instalado)
mongod --version
```

### 2. Configuración del Entorno de Desarrollo

#### MongoDB

```bash
# macOS con Homebrew
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Variables de Entorno

Asegúrate de que `.env` contenga:

```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://localhost:5000
```

### 3. Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Opción A: Ejecutar frontend y backend por separado
npm run server    # Terminal 1 - Backend Express.js
npm run dev       # Terminal 2 - Frontend Next.js

# Opción B: Ejecutar ambos simultáneamente
npm run dev:full

# Verificar build
npm run build

# Linting
npm run lint
```

### 4. URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### 5. Estructura de Desarrollo

```
Desarrollo del Frontend (Next.js):
├── src/app/page.tsx          # Página principal con auth
├── src/components/auth/      # Componentes de login/register
├── src/hooks/useAuth.tsx     # Hook de autenticación
└── src/app/api/              # API routes (proxy al backend)

Desarrollo del Backend (Express.js):
├── server/index.ts           # Servidor principal
├── server/models/            # Modelos de MongoDB
├── server/routes/            # Rutas de la API
└── server/middleware/        # Middleware de autenticación
```

### 6. Flujo de Trabajo

1. **Autenticación**: Ya implementada con JWT
2. **Próximo**: Implementar componentes del tablero Kanban
3. **Después**: CRUD de tareas con drag & drop
4. **Futuro**: Subtareas y funciones avanzadas

### 7. Debugging

```bash
# Logs del servidor
tail -f server.log

# Verificar conexión a MongoDB
mongo taskmanager --eval "db.stats()"

# Verificar puertos en uso
lsof -i :3000
lsof -i :5000
```

### 8. Testing

```bash
# API Health Check
curl http://localhost:5000/api/health

# Test de registro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
```

### 9. Próximas Tareas de Desarrollo

- [ ] Componente TaskBoard con columnas Kanban
- [ ] Componente TaskCard para mostrar tareas
- [ ] Modal para crear/editar tareas
- [ ] Implementar drag & drop
- [ ] Gestión de subtareas
- [ ] Filtros y búsqueda
- [ ] Notificaciones y feedback

### 10. Comandos Útiles

```bash
# Reiniciar MongoDB
brew services restart mongodb-community

# Limpiar caché de Next.js
rm -rf .next

# Reinstalar dependencias
rm -rf node_modules package-lock.json && npm install

# Ver logs de MongoDB
tail -f /opt/homebrew/var/log/mongodb/mongo.log
```

