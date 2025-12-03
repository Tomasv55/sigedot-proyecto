const express = require('express');
const router = express.Router();
const certController = require('../controllers/certificateController');
const { verifyToken } = require('../middleware/authMiddleware');
const { isAuditorOrAdmin, isAdmin } = require('../middleware/roleMiddleware');

// IMPORTANTE: Si configuraste Multer para subir archivos reales, descomenta esta línea:
// const upload = require('../config/multer'); 

// Todas las rutas de este archivo requieren estar logueado (tener Token válido)
router.use(verifyToken);

// --- RUTAS PÚBLICAS (Para cualquier usuario logueado) ---

// Listar certificados (Corredor ve los suyos, Admin/Auditor ven todos)
router.get('/', certController.getAllCertificates);

// Subir nuevo certificado
// Si tienes Multer activado, usa: router.post('/', upload.single('file'), certController.createCertificate);
// Si NO tienes Multer activado aún (solo datos):
router.post('/', certController.createCertificate);


// --- RUTAS PROTEGIDAS (Roles Específicos) ---

// Validar o Rechazar: Solo pueden hacerlo Auditores o Administradores
router.put('/:id/status', isAuditorOrAdmin, certController.updateStatus);

// Eliminar certificado: Solo puede hacerlo el Administrador Supremo
router.delete('/:id', isAdmin, certController.deleteCertificate);

module.exports = router;