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


// 0. Crear nueva recompensa
exports.createRecompensa = async (req, res) => {
  // Ajusta estos campos obligatorios según tu modelo
    const requiredFields = ["nombre", "descripcion", "nivel_requerido", "costo_puntos"];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        const {
        nombre,
        descripcion,
        nivel_requerido,
        costo_puntos
        } = req.body;

        const nueva = await db.Recompensa.create({
        nombre,
        descripcion,
        nivel_requerido,
        costo_puntos
        });

        res.status(201).json(nueva);
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
// 4. Canjear una recompensa y descontar puntos
exports.canjearRecompensa = async (req, res) => {
    const required = ["usuario_id", "recompensa_id"];
    if (!isRequestValid(required, req.body, res)) return;

    try {
        const { usuario_id, recompensa_id } = req.body;

        const usuario   = await db.Usuario.findByPk(usuario_id);
        const recompensa = await db.Recompensa.findByPk(recompensa_id);

        if (!usuario)   return res.status(404).json({ msg: "Usuario no encontrado" });
        if (!recompensa) return res.status(404).json({ msg: "Recompensa no encontrada" });

        // 1) Verificar nivel
        if (usuario.nivel !== recompensa.nivel_requerido) {
        return res.status(400).json({
            msg: `Nivel insuficiente (requiere ${recompensa.nivel_requerido})`
        });
        }

        // 2) Verificar puntos suficientes
        if (usuario.puntos < recompensa.costo_puntos) {
        return res.status(400).json({ msg: "Puntos insuficientes" });
        }

        // 3) Descontar puntos
        await usuario.decrement('puntos', { by: recompensa.costo_puntos });

        // 4) Guardar relación canjeada
        await usuario.addRecompensa(recompensa);

        // 5) Responder con el nuevo saldo
        const usuarioActualizado = await db.Usuario.findByPk(usuario_id, {
        attributes: ['id','nombre','puntos']
        });

        res.json({
        msg: "Recompensa canjeada con éxito",
        nuevo_saldo: usuarioActualizado.puntos
        });
    } catch (error) {
        sendError500(res, error);
    }
};
