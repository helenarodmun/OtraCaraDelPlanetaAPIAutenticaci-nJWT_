module.exports = (app) => {
  const localizaciones = require("../controllers/localizacion.controller.js");

  var router = require("express").Router();

  // Crear nueva actividad
  router.post("/nuevo", localizaciones.create);

  // Devuelve todos los usuarios
  router.get("/", localizaciones.findAll);

  // Devuleve un usuario a traves de la id
  router.get("/busca/:nombre", localizaciones.findOne);

  // Modificar un usuario a traves de la id
  router.put("/modifica/:nombre", localizaciones.update);

  // Borrar un usuario a traves de la id
  router.delete("/borra/:nombre", localizaciones.delete);

  // Crear un nuevo usuario
  router.delete("/borratodo", localizaciones.deleteAll);

  app.use("/localizaciones", router);
};
