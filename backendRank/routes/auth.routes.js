
const authController = require("../controllers/auth.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

module.exports = app => {
    const router = require("express").Router();

    // Registro público
    router.post('/register', authController.register);
    
    // Registro por administradores (con autenticación)
    router.post('/admin/register', [verifyToken, isAdmin], authController.register);

   // Obtener perfil del usuario logeado
    router.get('/profile', authController.getProfile);

    router.post('/login', authController.login);
    
    app.use('/auth', router);
};