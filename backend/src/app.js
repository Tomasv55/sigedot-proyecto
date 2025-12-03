const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importar las rutas
const authRoutes = require('./routes/authRoutes');
const certRoutes = require('./routes/certificateRoutes');
const userRoutes = require('./routes/userRoutes'); 

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// --- RUTAS DE LA API ---
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certRoutes);
app.use('/api/users', userRoutes); 

app.get('/', (req, res) => {
  res.json({ message: 'API SIGEDOT funcionando correctamente 🚀' });
});

module.exports = app;