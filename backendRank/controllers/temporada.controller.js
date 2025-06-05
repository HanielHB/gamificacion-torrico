// controllers/temporada.controller.js
const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");

// Helper para obtener temporada o devolver 404
async function getTemporadaOr404(id, res) {
    const temporada = await db.Temporada.findByPk(id);
    if (!temporada) {
        res.status(404).json({ msg: "Temporada no encontrada" });
        return null;
    }
    return temporada;
}

// 1. Listar todas las temporadas
exports.listTemporadas = async (req, res) => {
    try {
        const temporadas = await db.Temporada.findAll({
            order: [['fecha_inicio', 'DESC']]
        });
        res.json(temporadas);
    } catch (error) {
        sendError500(res, error);
    }
};

// 2. Obtener una temporada por ID
exports.getTemporadaById = async (req, res) => {
    const id = req.params.id;
    try {
        const temporada = await getTemporadaOr404(id, res);
        if (!temporada) return;
        
        res.json(temporada);
    } catch (error) {
        sendError500(res, error);
    }
};

// 3. Crear una nueva temporada
exports.createTemporada = async (req, res) => {
    // Campos requeridos
    const requiredFields = ["nombre", "fecha_inicio", "fecha_fin", "meta_comunitaria"];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        const { nombre, fecha_inicio, fecha_fin, meta_comunitaria } = req.body;

        const nuevaTemporada = await db.Temporada.create({
            nombre,
            fecha_inicio,
            fecha_fin,
            meta_comunitaria,
            activa: true
        });

        res.status(201).json(nuevaTemporada);
    } catch (error) {
        sendError500(res, error);
    }
};

// 4. Finalizar temporada y generar ranking
exports.finalizarTemporada = async (req, res) => {
    const id = req.params.id;
    try {
        const temporada = await getTemporadaOr404(id, res);
        if (!temporada) return;

        // 1. Marcar temporada como inactiva
        temporada.activa = false;
        await temporada.save();

        // 2. Calcular ranking para la temporada
        const rankingData = await db.AccionEcologica.findAll({
            where: { temporada_id: id },
            attributes: [
                'usuario_id',
                [db.sequelize.fn('sum', db.sequelize.col('puntos_otorgados')), 'total_puntos']
            ],
            group: ['usuario_id'],
            order: [[db.sequelize.literal('total_puntos'), 'DESC']],
            include: [{
                model: db.Usuario,
                as: 'usuario',
                attributes: ['nombre', 'nivel']
            }]
        });

        // 3. Guardar ranking en base de datos
        const rankingRecords = [];
        let puesto = 1;
        
        for (const item of rankingData) {
            let insignia = null;
            if (puesto === 1) insignia = "Sol";
            else if (puesto === 2) insignia = "Luna";
            else if (puesto === 3) insignia = "Tierra";

            rankingRecords.push({
                puesto,
                insignia,
                puntos_temporada: item.get('total_puntos'),
                usuario_id: item.usuario_id,
                temporada_id: id
            });

            puesto++;
        }

        await db.Ranking.bulkCreate(rankingRecords);

        res.json({
            msg: "Temporada finalizada y ranking generado",
            ranking: rankingRecords
        });
    } catch (error) {
        sendError500(res, error);
    }
};

// 5. Obtener ranking de una temporada
exports.getRankingTemporada = async (req, res) => {
    const temporadaId = req.params.id;
    try {
        const ranking = await db.Ranking.findAll({
            where: { temporada_id: temporadaId },
            order: [['puesto', 'ASC']],
            include: [{
                model: db.Usuario,
                as: 'usuario',
                attributes: ['id', 'nombre', 'nivel']
            }]
        });

        res.json(ranking);
    } catch (error) {
        sendError500(res, error);
    }
};