// Verifica si es Administrador (Para borrar cosas)
exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de Administrador.' });
  }
  next();
};

// Verifica si es Auditor o Admin (Para validar/rechazar documentos)
exports.isAuditorOrAdmin = (req, res, next) => {
  if (req.userRole !== 'admin' && req.userRole !== 'auditor') {
    return res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
  }
  next();
};