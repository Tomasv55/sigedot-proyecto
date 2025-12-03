const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // 1. Buscar el token en los encabezados (Header: Authorization)
  const authHeader = req.headers['authorization'];
  
  // El token suele venir así: "Bearer eyJhbGci..."
  // Así que separamos la palabra "Bearer" del código real
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Si no hay token, denegar acceso
  if (!token) {
    return res.status(403).json({ message: 'Acceso denegado: No se proporcionó token' });
  }

  // 3. Verificar si el token es válido (usando nuestra palabra secreta)
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    // 4. Si es válido, guardamos los datos del usuario dentro de la petición (req)
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    // 5. Dejar pasar al siguiente paso
    next();
  });
};