const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || "ecowarriors_secret";

// Middleware para verificar token
exports.verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Token inválido" });
    }
};

// Middleware para verificar rol de administrador
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.tipo === 'empleado') {
        next();
    } else {
        res.status(403).json({ msg: "Acceso denegado: se requiere rol de empleado" });
    }
};