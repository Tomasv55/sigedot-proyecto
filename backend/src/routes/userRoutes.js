const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

// Seguridad total: Login + Rol Admin requerido
router.use(verifyToken);
router.use(isAdmin);

// Definición de endpoints CRUD
router.get('/', userController.getAllUsers);        // Leer lista
router.put('/:id', userController.updateUser);      // Editar (NUEVO)
router.delete('/:id', userController.deleteUser);   // Eliminar

module.exports = router;