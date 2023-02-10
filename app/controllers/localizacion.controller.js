const db = require("../models");
const Localizacion = db.localizaciones;

// Crear y guardar una nueva lozalización
exports.create = (req, res) => {
  // Validar la petición
  if (!req.body.nombre) {
    res.status(400).send({ message: "¡El contenido no puede estar vacío!" });
    return;
  }

  // Crear localizacion
  const localizacion = new Localizacion({
    _id: new db.mongoose.Types.ObjectId(),
    coordenadas: req.body.coordenadas,
    nombre: req.body.nombre,
  });

  // Guardar localizacion
  localizacion
    .save(localizacion)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error mientras intentaba crear la actividad.",
      });
    });
};

// Devolver todas las localizacion de la base de datos
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Localizacion.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Se ha producido un error al recuperar las localizaciones.",
      });
    });
};

// Buscar una actividado por el nombre
exports.findOne = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Localizacion.findOne(condition)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({
            message:
              "No se ha encontrado una localizacion con el nombre" + nombre,
          });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message:
            "Error al recuperar la localizacion con el nombre= " + nombre,
        });
    });
};

// Modificar una localizacion, recuperandola por el nombre
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "¡Los datos a actualizar no pueden estar vacíos!",
    });
  }

  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Localizacion.updateOne(condition, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se puede actualizar la localizacion con nombre=${nombre}. ¡Tal vez no se encontró el usuario!`,
        });
      } else
        res.send({ message: "La localizacion se ha actualizado con éxito." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al actualizar la localizacion con nombre=" + nombre,
      });
    });
};

// Borrar una localizacion, recuperándola por el nombre

exports.delete = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Localizacion.findOneAndRemove(condition)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se ha podido eliminar la localizacion con nombre=${nombre}. ¡Tal vez no se encontró!`,
        });
      } else {
        res.send({
          message: "¡localizacion eliminado con éxito!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se puede borrar la localizacion con nombre=" + nombre,
      });
    });
};

// Borrar todas las localizacion de la base de datos
exports.deleteAll = (req, res) => {
  Localizacion.deleteMany({})
    .then((data) => {
      res.send({
        message: ` ¡Las localizacion se han eliminado correctamente!, en total se borraron ${data.deletedCount}`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Ocurrió un error al eliminar las localizacion.",
      });
    });
};
