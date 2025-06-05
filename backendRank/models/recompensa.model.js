module.exports = (sequelize, Sequelize) => {
    const Recompensa = sequelize.define(
        "recompensa",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: Sequelize.STRING,
                allowNull: false
            },
            nivel_requerido: {
                type: Sequelize.STRING,
                allowNull: false
            },
            beneficio: {
                type: Sequelize.STRING,
                allowNull: false
            },
            descripcion: {
                type: Sequelize.TEXT,
                allowNull: true
            }
        },
        {
            timestamps: true,
            tableName: "recompensas"
        }
    );

    return Recompensa;
};