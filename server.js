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


const corsOptions = {
  // Para permitir credenciales (cookies) con cualquier origen, NO podemos usar '*'.
  // Debemos devolver dinámicamente el origen que hace la petición.
  origin: (origin, callback) => {
    // Permitir cualquier origen (effectively allowing all) enviando 'true'
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true, // Esto requiere un origen específico (no '*')
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