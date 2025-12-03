const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

// Ruta para Registrarse
router.post('/register', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
  body('name').notEmpty().withMessage('Nombre requerido')
], authController.register);

// Ruta para Iniciar Sesión
router.post('/login', authController.login);

module.exports = router;