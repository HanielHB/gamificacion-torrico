// routes/usuario.routes.js
const controller = require("../controllers/usuario.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

module.exports = app => {
    const router = require("express").Router();

    // Listar todos los usuarios
    router.get('/', [verifyToken], controller.listUsuarios);

    router.post('/', [verifyToken], controller.createUsuario);


    // Obtener un usuario por ID
    router.get('/:id', [verifyToken], controller.getUsuarioById);

    // Actualizar un usuario
    router.put('/:id', [verifyToken], controller.updateUsuario);

    // Eliminar un usuario
    router.delete('/:id', [verifyToken, isAdmin], controller.deleteUsuario);

    // Registrar acción ecológica para un usuario
    router.post('/:id/acciones', [verifyToken], controller.registrarAccion);

    // Obtener acciones de un usuario
    router.get('/:id/acciones', [verifyToken], controller.getAccionesUsuario);

    app.use('/usuarios', router);
};