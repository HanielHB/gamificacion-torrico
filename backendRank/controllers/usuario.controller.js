// controllers/usuario.controller.js
const db = require("../models");
const { isRequestValid, sendError500 } = require("../utils/request.utils");

// Helper para obtener usuario o devolver 404
async function getUsuarioOr404(id, res) {
    const usuario = await db.Usuario.findByPk(id);
    if (!usuario) {
        res.status(404).json({ msg: "Usuario no encontrado" });
        return null;
    }
    return usuario;
}

// 1. Listar todos los usuarios
exports.listUsuarios = async (req, res) => {
    try {
        const whereCondition = {};
        if (req.query.tipo) {
            whereCondition.tipo = req.query.tipo;  // Filtra por tipo: cliente o empleado
        }

        const usuarios = await db.Usuario.findAll({ where: whereCondition });
        res.json(usuarios);
    } catch (error) {
        sendError500(res, error);
    }
};

// 2. Obtener un usuario por ID
exports.getUsuarioById = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) return;
        res.json(usuario);
    } catch (error) {
        sendError500(res, error);
    }
};

// 3. Crear un nuevo usuario
exports.createUsuario = async (req, res) => {
    // Campos requeridos
    const requiredFields = ["nombre", "tipo"];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        const { nombre, tipo, email, puntos, nivel } = req.body;

        const nuevoUsuario = await db.Usuario.create({
            nombre,
            tipo,
            email: email || null,
            puntos: puntos || 0,
            nivel: nivel || "Semilla"
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        sendError500(res, error);
    }
};

// 4. Actualizar un usuario existente
exports.updateUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) return;

        // Actualizamos solo los campos que se envíen
        if (req.body.nombre) usuario.nombre = req.body.nombre;
        if (req.body.tipo) usuario.tipo = req.body.tipo;
        if (req.body.email) usuario.email = req.body.email;
        if (req.body.puntos) usuario.puntos = req.body.puntos;
        if (req.body.nivel) usuario.nivel = req.body.nivel;

        await usuario.save();
        res.json(usuario);
    } catch (error) {
        sendError500(res, error);
    }
};

// 5. Eliminar un usuario
exports.deleteUsuario = async (req, res) => {
    const id = req.params.id;
    try {
        const usuario = await getUsuarioOr404(id, res);
        if (!usuario) return;

        await usuario.destroy();
        res.json({ msg: "Usuario eliminado correctamente" });
    } catch (error) {
        sendError500(res, error);
    }
};

// 6. Registrar acción ecológica para un usuario
exports.registrarAccion = async (req, res) => {
    const usuarioId = req.params.id;
    const requiredFields = ["tipo", "puntos_otorgados", "temporada_id"];
    if (!isRequestValid(requiredFields, req.body, res)) return;

    try {
        const usuario = await getUsuarioOr404(usuarioId, res);
        if (!usuario) return;

        const { tipo, puntos_otorgados, temporada_id, detalle } = req.body;

        // Registrar la acción
        const accion = await db.AccionEcologica.create({
            tipo,
            puntos_otorgados,
            usuario_id: usuarioId,
            temporada_id,
            detalle
        });

        // Actualizar puntos del usuario
        await usuario.increment('puntos', { by: puntos_otorgados });

        res.status(201).json({
            msg: "Acción registrada correctamente",
            accion,
            nuevo_puntos: usuario.puntos + puntos_otorgados
        });
    } catch (error) {
        sendError500(res, error);
    }
};

// 7. Obtener acciones de un usuario
exports.getAccionesUsuario = async (req, res) => {
    const usuarioId = req.params.id;
    try {
        const usuario = await getUsuarioOr404(usuarioId, res);
        if (!usuario) return;

        const acciones = await db.AccionEcologica.findAll({
            where: { usuario_id: usuarioId },
            order: [['fecha', 'DESC']]
        });

        res.json(acciones);
    } catch (error) {
        sendError500(res, error);
    }
};