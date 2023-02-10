module.exports = (app) => {
  const lugares = require("../controllers/lugar.controller.js");

  var router = require("express").Router();

  // Crear nueva actividad
  router.post("/nuevo", lugares.create);

  // Devuelve todos los usuarios
  router.get("/", lugares.findAll);

  // Devuleve un usuario a traves de la id
  router.get("/busca/:nombre", lugares.findOne);

  // Devuleve una actividad buscando por tipo de actividad
  router.get("/buscalocalizacion/:id", lugares.buscaPorlocalizacion);

  // Devuleve una actividad buscando por lugar
  router.get("/buscatipo/:id", lugares.buscaPorTipos);

  // Modificar un usuario a traves de la id
  router.put("/modifica/:nombre", lugares.update);

  // Borrar un usuario a traves de la id
  router.delete("/borra/:nombre", lugares.delete);

  // Crear un nuevo usuario
  router.delete("/borratodo", lugares.deleteAll);

  app.use("/lugares", router);
};
