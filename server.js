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


const allowedOrigins = ['https://conectar-dev.netlify.app', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Manejar preflight requests (OPTIONS)
app.options('*', cors());


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