module.exports = (app) => {
  const usuarios = require("../controllers/usuario.controller.js");

  var router = require("express").Router();

  // Devuelve todos los usuarios
  router.get("/", usuarios.findAll);

  // Crear nuevo usuaario
  router.post("/nuevo", usuarios.create);

  // Devuleve un usuario a traves de la id
  router.get("/busca/:id", usuarios.findOne);

  // Modificar un usuario a traves de la id
  router.put("/modifica/:id", usuarios.update);

  // Borrar un usuario a traves de la id
  router.delete("/borra/:id", usuarios.delete);

  // Crear un nuevo usuario
  router.delete("/borratodo", usuarios.deleteAll);

  app.use("/usuarios", router);
};
