// routes/temporada.routes.js
const controller = require("../controllers/temporada.controller");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

module.exports = app => {
    const router = require("express").Router();

    // Listar todas las temporadas
    router.get('/', controller.listTemporadas);

    // Obtener temporada por ID
    router.get('/:id', controller.getTemporadaById);

    // Crear nueva temporada (solo admin)
    router.post('/', [verifyToken, isAdmin], controller.createTemporada);

    // Finalizar temporada y generar ranking (solo admin)
    router.post('/:id/finalizar', controller.finalizarTemporada);

    // Obtener ranking de una temporada
    router.get('/:id/ranking', controller.getRankingTemporada);

    app.use('/temporadas', router);
};