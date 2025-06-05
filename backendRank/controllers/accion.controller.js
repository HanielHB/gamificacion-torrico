const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");

// 1. Listar todas las acciones ecológicas
exports.listAcciones = async (req, res) => {
    try {
        const acciones = await db.AccionEcologica.findAll({
            order: [['fecha', 'DESC']]
        });
        res.json(acciones);
    } catch (error) {
        sendError500(res, error);
    }
};

// 2. Registrar acción ecológica
exports.registrarAccion = async (req, res) => {
    const requiredFields = ["tipo", "puntos_otorgados", "usuario_id", "temporada_id"];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        const { tipo, puntos_otorgados, usuario_id, temporada_id, detalle } = req.body;

        // Verificar que usuario existe
        const usuario = await db.Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Verificar que temporada existe y está activa
        const temporada = await db.Temporada.findByPk(temporada_id);
        if (!temporada || !temporada.activa) {
            return res.status(400).json({ msg: "Temporada no válida o inactiva" });
        }

        // Registrar la acción
        const accion = await db.AccionEcologica.create({
            tipo,
            puntos_otorgados,
            usuario_id,
            temporada_id,
            detalle,
            fecha: new Date()
        });

        // Actualizar puntos del usuario
        await usuario.increment('puntos', { by: puntos_otorgados });

        res.status(201).json(accion);
    } catch (error) {
        sendError500(res, error);
    }
};