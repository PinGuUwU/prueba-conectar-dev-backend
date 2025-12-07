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
const whitelist = [
  process.env.VITE_FRONTEND_URI || process.env.FRONTEND_URI,
  "http://localhost:5173/",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Importante para cookies/sesiones si las usas
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

// Conectar a MongoDB
// Conexión a MongoDB (Se ejecutará en el "arranque en frío" de la función)
mongoose
  .connect(process.env.VITE_MONGODB_URI || MONGODB_URI)
  .then(() => {
    // Es mejor no usar console.log en el entorno serverless de producción para mantenerlo limpio
    // console.log("Conectado a MongoDB"); 
  })
  .catch((err) => console.log("Error al conectar a MongoDB", err));

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
})

export default app;