

module.exports = (app) => {
  const actividades = require("../controllers/actividad.controller.js");

  var router = require("express").Router();

  // Crear nueva actividad
  router.post("/nuevo",  actividades.create);

  // Devuelve todos las actividades
  router.get("/", actividades.findAll);

  // Devuleve una actividad a traves del nombre
  router.get("/busca/:nombre", actividades.findOne);

  // Devuleve una actividad buscando por tipo de actividad
  router.get("/buscatipo/:id", actividades.buscaPorTipos);

  // Devuleve una actividad buscando por lugar
  router.get("/buscalugar/:id", actividades.buscaPorLugar);

  // Modificar un usuario a traves de la id
  router.put("/modifica/:nombre", actividades.update);

  // Borrar un usuario a traves de la id
  router.delete("/borra/:nombre", actividades.delete);

  // Crear un nuevo usuario
  router.delete("/borratodo", actividades.deleteAll);

  app.use("/actividades", router);
};
