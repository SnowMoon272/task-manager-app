import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Task Manager API is running",
    timestamp: new Date().toISOString(),
  });
});

// Simple test routes
app.get("/", (req, res) => {
  res.json({ message: "Task Manager Backend is running!" });
});

// Auth mock routes for testing
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "test@example.com" && password === "password") {
    res.json({
      success: true,
      message: "Login successful",
      data: {
        token: "mock-jwt-token",
        user: {
          id: "1",
          email: "test@example.com",
          name: "Usuario de Prueba",
          role: "user",
        },
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Credenciales inválidas",
    });
  }
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  res.json({
    success: true,
    message: "Usuario creado exitosamente",
    data: {
      token: "mock-jwt-token",
      user: {
        id: "2",
        email,
        name,
        role: "user",
      },
    },
  });
});

app.get("/api/auth/me", (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: "1",
        email: "test@example.com",
        name: "Usuario de Prueba",
        role: "user",
      },
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Backend test server started`);
  console.log(`🔗 Try: http://localhost:${PORT}/api/health`);
});

export default app;

