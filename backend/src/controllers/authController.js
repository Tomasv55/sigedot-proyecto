const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGICA DE REGISTRO
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // 2. Crear el usuario (La contraseña se encripta sola gracias al Modelo User.js)
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: role || 'corredor' // Si no envían rol, será corredor por defecto
    });

    // 3. Responder con éxito
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      userId: user.id 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// LOGICA DE LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Credenciales inválidas (Usuario no encontrado)' });
    }

    // 2. Verificar si está activo
    if (!user.isActive) {
      return res.status(403).json({ message: 'Tu cuenta ha sido desactivada. Contacta al admin.' });
    }

    // 3. Comparar contraseñas
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas (Contraseña incorrecta)' });
    }

    // 4. Generar Token de seguridad (JWT)
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Datos que guardamos en el token
      process.env.JWT_SECRET,           // La llave secreta del .env
      { expiresIn: '8h' }               // El token dura 8 horas
    );

    // 5. Responder con el token y datos del usuario
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};