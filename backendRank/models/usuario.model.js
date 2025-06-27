module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define(
        "usuario",
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
            puntos: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            nivel: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "Semilla"
            },
            tipo: {
                type: Sequelize.ENUM("cliente", "empleado"),
                allowNull: false,
                defaultValue: "cliente"
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
        },
        {
            timestamps: true,
            tableName: "usuarios",
            paranoid: true
        }
    );

    return Usuario;
};