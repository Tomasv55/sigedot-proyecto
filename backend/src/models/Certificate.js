const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Importamos el usuario para relacionarlos

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'validated', 'rejected'),
    defaultValue: 'pending'
  },
  size: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.STRING, 
    defaultValue: 'General'
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

// Relaciones: Un Usuario tiene muchos Certificados
User.hasMany(Certificate, { foreignKey: 'userId' });
Certificate.belongsTo(User, { foreignKey: 'userId' });

module.exports = Certificate;