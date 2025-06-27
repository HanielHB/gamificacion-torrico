module.exports = app => {
    require('./usuario.routes')(app);
    require('./temporada.routes')(app);
    require('./auth.routes')(app);
    require('./recompensa.routes')(app);
    require('./accion.routes')(app);
};