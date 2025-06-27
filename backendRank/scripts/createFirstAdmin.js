// scripts/createFirstAdmin.js
const bcrypt = require('bcryptjs');
const db = require('../models');

module.exports = async () => {
    try {
    // Verificar si ya existe algún admin
    const adminExists = await db.Usuario.findOne({
        where: { tipo: 'empleado' }
    });

    if (adminExists) {
        console.log('👤 Usuario administrador ya existe');
    return;
    }

    // Crear admin si no existe
    const hashedPassword = await bcrypt.hash('AdminPassword123', 10);
    
    await db.Usuario.create({
        nombre: 'Admin EcoWarriors',
        email: 'admin@ecowarriors.com',
        password: hashedPassword,
        tipo: 'empleado',
        puntos: 0,
        nivel: 'Admin'
    });
    
    console.log('🛡️  Usuario administrador creado con éxito');
    console.log('📧 Email: admin@ecowarriors.com');
    console.log('🔑 Contraseña: AdminPassword123');
    console.log('⚠️  IMPORTANTE: Cambia esta contraseña inmediatamente después del primer login!');
    
    } catch (error) {
        console.error('🔥 Error crítico al crear admin:', error);
        throw error; // Propagar el error para manejo superior
    }
};