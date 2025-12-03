const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Necesario para re-encriptar contraseña si se edita

// OBTENER TODOS LOS USUARIOS (Solo Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'isActive', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

'// ACTUALIZAR USUARIO (Nuevo)'
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password, isActive } = req.body;

    // 1. Buscar usuario
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // 2. Actualizar campos simples
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    // 3. Si viene contraseña nueva, encriptarla
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // 4. Guardar cambios
    await user.save();

    res.json({ message: 'Usuario actualizado correctamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// ELIMINAR USUARIO (Solo Admin)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (parseInt(id) === req.userId) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
    }

    const deleted = await User.destroy({ where: { id } });
    
    if (deleted) {
      res.json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};