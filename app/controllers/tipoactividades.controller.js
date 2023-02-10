const { actividades } = require("../models");
const db = require("../models");
const TipoActividad = db.tipoActividades;

// Crear y guardar un nuevo tipolugar
exports.create = (req, res) => {
  // Validar la petición
  if (!req.body.nombre) {
    res.status(400).send({ message: "¡El contenido no puede estar vacío!" });
    return;
  }

  // Crear tipoActividad
  const tipoActividad = new TipoActividad({
    _id: new db.mongoose.Types.ObjectId(),
    nombre: req.body.nombre,
  });

  // Guardar tipoActividad
  tipoActividad
    .save(tipoActividad)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error mientras intentaba crear el tipo de actividad.",
      });
    });
};

// Devolver todas los tipos de actividad de la base de datos
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  TipoActividad.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Se ha producido un error al recuperar los tipos de actividad.",
      });
    });
};

// Buscar un tipoActividad por el nombre
exports.findOne = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  TipoActividad.findOne(condition)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({
            message: "No se ha encontrado un tipo con el nombre" + nombre,
          });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message:
            "Error al recuperar el tipo de lugar con el nombre= " + nombre,
        });
    });
};

// Modificar un tipoActividad, recuperandola por el nombre
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

  TipoActividad.updateOne(condition, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se puede actualizar el tipoActividad con nombre=${nombre}. ¡Tal vez no se encontró el tipo!`,
        });
      } else
        res.send({ message: "El tipoActividad se ha actualizado con éxito." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al actualizar el tipo con nombre=" + nombre,
      });
    });
};

// Borrar un tipoActividad, recuperándola por el nombre

exports.delete = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  TipoActividad.findOneAndRemove(condition)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se ha podido eliminar el tipoActividad con nombre=${nombre}. ¡Tal vez no se encontró!`,
        });
      } else {
        res.send({
          message: "¡Tipo eliminado con éxito!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se puede borrar el tipo de actividad con nombre=" + nombre,
      });
    });
};

// Borrar todas las localizacion de la base de datos
exports.deleteAll = (req, res) => {
  TipoActividad.deleteMany({})
    .then((data) => {
      res.send({
        message: ` ¡Los tipos de actividad se han eliminado correctamente!, en total se borraron ${data.deletedCount}`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Ocurrió un error al eliminar los tipos de actividad.",
      });
    });
};
