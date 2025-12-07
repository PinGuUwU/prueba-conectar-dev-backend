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
const FRONTEND_URL_PROD = process.env.VITE_FRONTEND_URI || process.env.FRONTEND_URI;
const LOCAL_URL = "http://localhost:5173"; // Aseguramos que NO tiene barra final

// 2. Crear la lista blanca de dominios permitidos.
// Inicializamos la lista con la URL local y, si la URL de producción existe, la añadimos.
const whitelist = [
  LOCAL_URL
];

if (FRONTEND_URL_PROD) {
  const cleanProdUrl = FRONTEND_URL_PROD.replace(/\/$/, "");
  whitelist.push(cleanProdUrl);
} else {
  console.error("ADVERTENCIA: La variable FRONTEND_URI no está configurada en el entorno de Render.");
}
const corsOptions = {
  origin: (origin, callback) => {
    // Si la solicitud no tiene un 'Origin' (ej. peticiones internas o Postman), la permitimos.
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // Este error es el que estás viendo en los logs de Render
      callback(new Error(`Not allowed by CORS: Origen ${origin}`));
    }
  },
  credentials: true,
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