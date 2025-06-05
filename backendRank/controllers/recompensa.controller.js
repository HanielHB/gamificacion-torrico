const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");

// 1. Listar todas las recompensas
exports.listRecompensas = async (req, res) => {
    try {
        const recompensas = await db.Recompensa.findAll();
        res.json(recompensas);
    } catch (error) {
        sendError500(res, error);
    }
};

// 2. Asignar recompensa a un usuario
exports.asignarRecompensa = async (req, res) => {
    const requiredFields = ["usuario_id", "recompensa_id"];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        const { usuario_id, recompensa_id } = req.body;

        // Verificar que usuario existe
        const usuario = await db.Usuario.findByPk(usuario_id);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Verificar que recompensa existe
        const recompensa = await db.Recompensa.findByPk(recompensa_id);
        if (!recompensa) {
            return res.status(404).json({ msg: "Recompensa no encontrada" });
        }

        // Verificar que usuario tiene el nivel requerido
        if (usuario.nivel !== recompensa.nivel_requerido) {
            return res.status(400).json({ 
                msg: `El usuario no tiene el nivel requerido (${recompensa.nivel_requerido})` 
            });
        }

        // Asignar recompensa (relación N:M)
        await usuario.addRecompensa(recompensa);

        res.json({ 
            msg: "Recompensa asignada correctamente",
            usuario: usuario.nombre,
            recompensa: recompensa.nombre
        });
    } catch (error) {
        sendError500(res, error);
    }
};

// 3. Obtener recompensas de un usuario
exports.getRecompensasUsuario = async (req, res) => {
    const usuarioId = req.params.id;
    try {
        const usuario = await db.Usuario.findByPk(usuarioId, {
            include: [{
                model: db.Recompensa,
                as: 'recompensas',
                through: { attributes: [] } // Ocultar tabla intermedia
            }]
        });

        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        res.json(usuario.recompensas);
    } catch (error) {
        sendError500(res, error);
    }
};