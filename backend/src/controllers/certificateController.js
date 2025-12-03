const Certificate = require('../models/Certificate');
const User = require('../models/User');

// LISTAR CERTIFICADOS
exports.getAllCertificates = async (req, res) => {
  try {
    let whereClause = {};
    
    // LOGICA DE ROLES:
    // Si es "corredor", SOLO ve sus propios archivos.
    // Si es "admin" o "auditor", ven TODO.
    if (req.userRole === 'corredor') {
      whereClause = { userId: req.userId };
    }

    const certs = await Certificate.findAll({
      where: whereClause,
      include: [{ // Traemos el nombre del usuario dueño del archivo
        model: User, 
        attributes: ['name', 'email', 'role'] 
      }],
      order: [['createdAt', 'DESC']] // Ordenar por fecha (más nuevo arriba)
    });

    res.json(certs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener certificados' });
  }
};

// CREAR CERTIFICADO
exports.createCertificate = async (req, res) => {
  try {
    // Si usaste Multer, req.file tendrá el archivo. Si no, simulamos con el body.
    const { filename, type, size } = req.body;

    const newCert = await Certificate.create({
      userId: req.userId, // El ID viene del token (seguridad)
      filename: req.file ? req.file.filename : filename, // Soporte para Multer o simulación
      type: type || 'General',
      size: req.file ? (req.file.size / 1024 / 1024).toFixed(2) + ' MB' : (size || '1.5 MB'),
      status: 'pending' // Siempre empieza pendiente
    });

    res.status(201).json({ message: 'Certificado creado', certificate: newCert });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear certificado' });
  }
};

// ACTUALIZAR ESTADO (Aprobar/Rechazar) - SOLO ADMIN/AUDITOR
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Esperamos 'validated' o 'rejected'

    const cert = await Certificate.findByPk(id);
    if (!cert) return res.status(404).json({ message: 'Certificado no encontrado' });

    cert.status = status;
    await cert.save();

    res.json({ message: `Certificado actualizado a: ${status}`, certificate: cert });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
};

// ELIMINAR CERTIFICADO - SOLO ADMIN
exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Certificate.destroy({ where: { id } });
    
    if (deleted) {
      res.json({ message: 'Certificado eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Certificado no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar' });
  }
};