# Task Manager App ✨

Una aplicación completa de gestión de tareas con tablero Kanban interactivo.

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# Database Configuration - Elige una opción:

# Opción A: MongoDB Local
MONGODB_URI=mongodb://localhost:27017/taskmanager

# Opción B: MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://castielaltair0027:MyVXAf5IHS1vlvyQ@cluster0.xkaqiiv.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0

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

### 3. Configurar MongoDB (Solo si usas local)

```bash
# Instalar MongoDB con Homebrew (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Iniciar el servicio
brew services start mongodb-community
```

### 4. Ejecutar la Aplicación

**Opción Recomendada - Ejecutar todo:**

```bash
npm run dev:full
```

**Opción Alternativa - Por separado:**

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run dev
```

### 5. Verificar que Funciona

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:5001](http://localhost:5001)
- **Health Check**: [http://localhost:5001/api/health](http://localhost:5001/api/health)

## 🔧 Comandos Principales

```bash
npm run dev:full     # Ejecuta frontend y backend simultáneamente
npm run dev          # Solo frontend (puerto 3000)
npm run server       # Solo backend (puerto 5001)
npm run build        # Construir para producción
npm run lint         # Verificar código
```

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Base de datos**: MongoDB + Mongoose
- **Autenticación**: JWT
- **UI**: Drag & Drop Kanban Board

## 📚 Documentación Completa

Para información detallada sobre arquitectura, características, API, troubleshooting y más:

**👉 [Ver Documentación Completa](./READMEDoc.md)**

## 🐛 Problemas Comunes

### MongoDB no conecta

```bash
# Verificar que MongoDB esté corriendo
brew services list | grep mongodb

# Iniciar MongoDB si no está activo
brew services start mongodb-community
```

### Puerto en uso

```bash
# Liberar puerto 3000 o 5001
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

### Error de JWT

```bash
# Verificar que JWT_SECRET esté en .env
echo $JWT_SECRET
```

---

**¿Problemas?** Consulta la [documentación completa](./READMEDoc.md) o revisa la sección de [solución de problemas](./READMEDoc.md#-solución-de-problemas).

