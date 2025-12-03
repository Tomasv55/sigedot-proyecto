const app = require('./src/app');
const sequelize = require('./src/config/database');

// <--- IMPORTANTE: Cargar los modelos para que Sequelize sepa que existen
require('./src/models/User');
require('./src/models/Certificate');

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    // Intentar conectar a la Base de Datos
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente.');

    // Sincronizar tablas (crearlas si no existen)
    // 'alter: true' ayuda a actualizar las tablas si haces cambios después
    await sequelize.sync({ alter: true }); 
    console.log('✅ Base de datos sincronizada (Tablas creadas).');

    // Arrancar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
}

main();