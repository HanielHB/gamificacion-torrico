module.exports = (sequelize, Sequelize) => {
    const AccionEcologica = sequelize.define(
        "accion_ecologica",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            tipo: {
                type: Sequelize.ENUM(
                    "bolsa_reutilizable", 
                    "reciclaje_plastico", 
                    "compra_local", 
                    "taller_ecologico",
                    "desafio_comunitario"
                ),
                allowNull: false
            },
            puntos_otorgados: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            detalle: {
                type: Sequelize.STRING,
                allowNull: true
            },
            fecha: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        },
        {
            timestamps: true,
            tableName: "acciones_ecologicas"
        }
    );

    return AccionEcologica;
};