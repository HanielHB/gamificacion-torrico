const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendError500 } = require("../utils/request.utils");

const SECRET_KEY = process.env.SECRET_KEY || "ecowarriors_secret";

// 1. Login de usuario
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            msg: "Email y contraseña son requeridos" 
        });
    }

    try {
        // Buscar usuario por email
        const usuario = await db.Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Credenciales inválidas" });
        }

        // Generar token JWT (expira en 2 horas)
        const token = jwt.sign(
            {
                id: usuario.id,
                nombre: usuario.nombre,
                tipo: usuario.tipo,
                email: usuario.email
            },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        // Enviar respuesta con token y datos del usuario (sin contraseña)
        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                tipo: usuario.tipo,
                puntos: usuario.puntos,
                nivel: usuario.nivel
            }
        });

    } catch (error) {
        sendError500(res, error);
    }
};

// 2. Logout (simbólico, el cliente debe eliminar el token)
exports.logout = (req, res) => {
    res.json({ msg: "Sesión cerrada exitosamente. Por favor, elimina el token en el cliente." });
};

// 3. Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
    try {
        // El middleware verifyToken ya puso el usuario en req.user
        const usuario = await db.Usuario.findByPk(req.user.id, {
            attributes: { exclude: ['password'] } // Excluir contraseña
        });
        
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        
        res.json(usuario);
    } catch (error) {
        sendError500(res, error);
    }
};

// 4. Registrar nuevo usuario (para registro público)
exports.register = async (req, res) => {
    const { nombre, email, password, tipo } = req.body;
    
    // Campos mínimos requeridos
    if (!nombre || !email || !password) {
        return res.status(400).json({ 
            msg: "Nombre, email y contraseña son requeridos" 
        });
    }

    try {
        // Verificar si el email ya existe
        const existingUser = await db.Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: "El email ya está registrado" });
        }

        // Determinar tipo de usuario
        let userType = "cliente";
        let isAdminCreation = false;
        
        // Si viene de un admin y se especifica tipo
        if (req.user && req.user.tipo === "empleado" && tipo) {
            userType = tipo;
            isAdminCreation = true;
        }

        // Cifrar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const nuevoUsuario = await db.Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            tipo: userType,
            puntos: 0,
            nivel: "Semilla"
        });

        // Respuesta diferente según quién crea el usuario
        if (isAdminCreation) {
            return res.status(201).json({
                usuario: {
                    id: nuevoUsuario.id,
                    nombre: nuevoUsuario.nombre,
                    email: nuevoUsuario.email,
                    tipo: nuevoUsuario.tipo,
                    puntos: nuevoUsuario.puntos,
                    nivel: nuevoUsuario.nivel
                }
            });
        }

        // Para registro público: generar token automático
        const token = jwt.sign(
            {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                tipo: nuevoUsuario.tipo,
                email: nuevoUsuario.email
            },
            SECRET_KEY,
            { expiresIn: "2h" }
        );

        res.status(201).json({
            token,
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email,
                tipo: nuevoUsuario.tipo,
                puntos: nuevoUsuario.puntos,
                nivel: nuevoUsuario.nivel
            }
        });
    } catch (error) {
        sendError500(res, error);
    }

};