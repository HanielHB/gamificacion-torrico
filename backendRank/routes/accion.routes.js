// routes/accion.routes.js
const controller = require("../controllers/accion.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

module.exports = app => {
    const router = require("express").Router();

    // Listar todas las acciones ecológicas
    router.get('/list_acciones', [verifyToken, isAdmin], controller.listAcciones);

    // Registrar acción ecológica
    router.post('/registrar', [verifyToken], controller.registrarAccion);

    app.use('/acciones', router);
};