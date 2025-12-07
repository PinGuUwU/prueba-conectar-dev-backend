import express from 'express'
import mongoose from 'mongoose'
import userRoutes from './routes/userRoutes.js';
import opinionRoutes from './routes/opinionRoutes.js';
import servicioRoutes from './routes/servicioRoutes.js';
import tipoServicioRoutes from './routes/tipoServicioRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import technologyRoutes from './routes/technologyRoutes.js';
import linkedinRouter from './routes/linkedin-router.js';
// Importación necesaria para poder traer variables del .env
import 'dotenv/config';
import cors from 'cors'


// Crear la aplicación de Express
const app = express();
const MONGODB_URI = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI
const PORT = 8080;


// Middleware para manejar JSON
app.use(express.json());


//Configuración para permitir solicitudes desde el frontend
// Usamos el valor de la variable de entorno que sea más precisa.
const NETLIFY_DOMAIN = "conectar-dev.netlify.app"; // Solo el dominio base
const LOCAL_URL = "http://localhost:5173";

const whitelist = [
  LOCAL_URL,
  `https://${NETLIFY_DOMAIN}`, // Versión HTTPS
  `http://${NETLIFY_DOMAIN}`   // Versión HTTP (La necesaria) 
];
console.log("📋 Whitelist actual:", whitelist);

const corsOptions = {
  origin: (origin, callback) => {
    // Si la solicitud no tiene un 'Origin' (ej. peticiones internas o Postman), la permitimos.
    if (!origin) return callback(null, true);

    // DEBUG: Loguear cada intento de conexión
    console.log(`📡 CORS Request from origin: ${origin}`);

    // Check directo para Netlify (evitar problemas de whitelist dinámica)
    if (origin === 'https://conectar-dev.netlify.app' || origin === 'https://conectar-dev.netlify.app/') {
      return callback(null, true);
    }

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`⛔ [BLOQUEO CRÍTICO] El origen '${origin}' NO está en la whitelist:`, whitelist);
      // Cambiamos el mensaje de error para verificar si se está ejecutando el código nuevo
      callback(new Error(`CORS BLOQUEADO (NUEVO): Origen '${origin}' no permitido.`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions))


// Ruta básica para probar
app.get('/', (req, res) => {
  res.json({
    message: '¡Hola! Tu servidor está funcionando 🎉',
    fecha: new Date()
  });
});

// --- RUTAS ---
//Ruta de usuarios
app.use('/api/users/', userRoutes)


//Ruta de opiniones
app.use('/api/opinions/', opinionRoutes)

//Ruta de servicios
app.use('/api/servicios/', servicioRoutes)

//Ruta de tipos de servicios
app.use('/api/types/', tipoServicioRoutes)

//Ruta de dashboard 
app.use('/api/dashboard/', dashboardRoutes)

//Ruta de tecnologias
app.use('/api/technologies', technologyRoutes)

//Ruta de autenticación LinkedIn
app.use('/api/auth/linkedin', linkedinRouter)

// Conexión a MongoDB (Se ejecutará en el "arranque en frío" de la función)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado a MongoDB 🎉"); // <-- Descomenta esto temporalmente
  })
  .catch((err) => console.log("Error al conectar a MongoDB", err));

app.listen();

export default app;