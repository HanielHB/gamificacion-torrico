// routes/recompensa.routes.js
const controller = require("../controllers/recompensa.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

module.exports = app => {
    const router = require("express").Router();

    // Listar todas las recompensas
    router.get('/', controller.listRecompensas);

    // Asignar recompensa a un usuario
    router.post('/asignar', [verifyToken], controller.asignarRecompensa);

    router.post("/",[ verifyToken, isAdmin ],controller.createRecompensa);

    router.post(
    '/canjear',
    verifyToken,
    controller.canjearRecompensa
    );


    // Obtener recompensas de un usuario
    router.get('/usuario/:id', [verifyToken], controller.getRecompensasUsuario);

    app.use('/recompensas', router);
};