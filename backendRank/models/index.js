const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    define: {
        timestamps: true,
        underscored: true,
    },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.Usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.AccionEcologica = require("./accion_ecologica.model.js")(sequelize, Sequelize);
db.Temporada = require("./temporada.model.js")(sequelize, Sequelize);
db.Recompensa = require("./recompensa.model.js")(sequelize, Sequelize);
db.Ranking = require("./ranking.model.js")(sequelize, Sequelize);

/* 
    Relaciones del Sistema EcoWarriors
    -----------------------------------
    1. Un usuario puede realizar muchas acciones ecológicas
    2. Una acción ecológica pertenece a una temporada
    3. Un usuario puede ganar muchas recompensas (relación N:M)
    4. Un ranking pertenece a un usuario y a una temporada
    5. Una temporada tiene muchas acciones ecológicas
    6. Una temporada tiene un ranking asociado
*/

// 1. Relación Usuario -> Acciones Ecológicas
db.Usuario.hasMany(db.AccionEcologica, {
    foreignKey: "usuario_id",
    as: "acciones"
});
db.AccionEcologica.belongsTo(db.Usuario, {
    foreignKey: "usuario_id",
    as: "usuario"
});

// 2. Relación Acción Ecológica -> Temporada
db.AccionEcologica.belongsTo(db.Temporada, {
    foreignKey: "temporada_id",
    as: "temporada"
});
db.Temporada.hasMany(db.AccionEcologica, {
    foreignKey: "temporada_id",
    as: "acciones"
});

// 3. Relación Usuario <-> Recompensas (N:M)
db.Usuario.belongsToMany(db.Recompensa, {
    through: "usuario_recompensa",
    foreignKey: "usuario_id",
    as: "recompensas",
    timestamps: false
});
db.Recompensa.belongsToMany(db.Usuario, {
    through: "usuario_recompensa",
    foreignKey: "recompensa_id",
    as: "usuarios",
    timestamps: false
});

// 4. Relación Ranking -> Usuario
db.Ranking.belongsTo(db.Usuario, {
    foreignKey: "usuario_id",
    as: "usuario"
});
db.Usuario.hasMany(db.Ranking, {
    foreignKey: "usuario_id",
    as: "rankings"
});

// 5. Relación Ranking -> Temporada
db.Ranking.belongsTo(db.Temporada, {
    foreignKey: "temporada_id",
    as: "temporada"
});
db.Temporada.hasMany(db.Ranking, {
    foreignKey: "temporada_id",
    as: "clasificacion"
});

// 6. Relación Usuario -> Puntos en Temporada (a través de acciones)
// Esta relación se manejará mediante consultas, no necesita asociación directa

module.exports = db;