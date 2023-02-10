const db = require("../models");
const TipoLugar = db.tipoLugares;

// Crear y guardar un nuevo tipolugar
exports.create = (req, res) => {
  // Validar la petición
  if (!req.body.nombre) {
    res.status(400).send({ message: "¡El contenido no puede estar vacío!" });
    return;
  }

  // Crear tipolugar
  const tipoLugar = new TipoLugar({
    _id: new db.mongoose.Types.ObjectId(),
    nombre: req.body.nombre,
  });

  // Guardar tipoLugar
  tipoLugar
    .save(tipoLugar)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error mientras intentaba crear el tipo de lugar.",
      });
    });
};

// Devolver todas los tipos de lugar de la base de datos
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  TipoLugar.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Se ha producido un error al recuperar los tipos de lugar.",
      });
    });
};

// Buscar un tipoLugar por el nombre
exports.findOne = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  TipoLugar.findOne(condition)
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

  TipoLugar.updateOne(condition, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se puede actualizar el tipoLugar con nombre=${nombre}. ¡Tal vez no se encontró el tipo!`,
        });
      } else res.send({ message: "El TipoLugar se ha actualizado con éxito." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al actualizar el tipo con nombre=" + nombre,
      });
    });
};

// Borrar una localizacion, recuperándola por el nombre

exports.delete = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  TipoLugar.findOneAndRemove(condition)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se ha podido eliminar el tipoLugar con nombre=${nombre}. ¡Tal vez no se encontró!`,
        });
      } else {
        res.send({
          message: "¡Tipo eliminado con éxito!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se puede borrar el tipo de lugar con nombre=" + nombre,
      });
    });
};

// Borrar todas las localizacion de la base de datos
exports.deleteAll = (req, res) => {
  TipoLugar.deleteMany({})
    .then((data) => {
      res.send({
        message: ` ¡Los tipos de lugares se han eliminado correctamente!, en total se borraron ${data.deletedCount}`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Ocurrió un error al eliminar los tipos de lugares.",
      });
    });
};
