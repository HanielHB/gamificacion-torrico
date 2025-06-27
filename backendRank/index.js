const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();

// Configuración de CORS
var corsOptions = {
    origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));

// Middleware para analizar JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos desde 'public'
app.use(express.static('public'));

// Asegurar que la carpeta 'uploads' exista
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Servir archivos estáticos desde 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Configuración de multer para la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Guardar en la carpeta 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
    }
});
const upload = multer({ storage: storage });

// 1. Importar la función para crear el primer admin
const createFirstAdmin = require('./scripts/createFirstAdmin');

// Importar y sincronizar la base de datos
const db = require("./models");

// 2. Sincronizar DB y luego crear admin
db.sequelize.sync({ force: false }) // force: true solo en desarrollo para resetear
    .then(async () => {
        console.log("✅ DB sincronizada correctamente");
        
        // 3. Crear admin solo si no existe
        try {
        await createFirstAdmin();
            console.log("🛡️  Verificación de admin completada");
        } catch (error) {
            console.error("⚠️  Error al crear admin inicial:", error);
        }
    })
    .catch(err => {
        console.error("❌ Error al sincronizar DB:", err);
    });

    // Middleware para validación de errores en JSON
    app.use((error, req, res, next) => {
        if (error instanceof SyntaxError) {
            res.status(400).json({ msg: 'Error en el JSON' });
        } else {
            next();
        }
    });

    // Importar rutas
    require('./routes')(app);

    // 4. Manejo de errores global
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ msg: 'Error interno del servidor' });
    });

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});