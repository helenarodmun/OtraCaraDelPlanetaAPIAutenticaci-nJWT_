const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.usuarios = require("./usuario.model.js")(mongoose);
db.actividades = require("./actividad.model.js")(mongoose);
db.eventos = require("./evento.model.js")(mongoose);
db.localizaciones = require("./localizacion.model.js")(mongoose);
db.lugares = require("./lugar.model.js")(mongoose);
db.tipoActividades = require("./tipoActividad.model.js")(mongoose);
db.tipoLugares = require("./tipoLugar.model.js")(mongoose);

module.exports = db;
