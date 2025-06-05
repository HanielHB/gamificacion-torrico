module.exports = (sequelize, Sequelize) => {
    const Ranking = sequelize.define(
        "ranking",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            puesto: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            insignia: {
                type: Sequelize.STRING,
                allowNull: true
            },
            puntos_temporada: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            timestamps: true,
            tableName: "rankings"
        }
    );

    return Ranking;
};