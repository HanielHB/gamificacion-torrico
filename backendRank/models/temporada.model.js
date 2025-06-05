module.exports = (sequelize, Sequelize) => {
    const Temporada = sequelize.define(
        "temporada",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            fecha_inicio: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            fecha_fin: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            meta_comunitaria: {
                type: Sequelize.STRING,
                allowNull: false
            },
            activa: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        },
        {
            timestamps: true,
            tableName: "temporadas"
        }
    );

    return Temporada;
};