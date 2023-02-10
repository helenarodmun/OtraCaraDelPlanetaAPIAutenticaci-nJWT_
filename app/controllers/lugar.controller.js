const db = require("../models");
const Lugar = db.lugares;

// Crear y guardar un nuevo lugar
exports.create = (req, res) => {
  // Validar la petición
  if (!req.body.nombre) {
    res.status(400).send({ message: "¡El contenido no puede estar vacío!" });
    return;
  }

  // Crear lugar
  const lugar = new Lugar({
    _id: new db.mongoose.Types.ObjectId(),
    localizacion: req.body.localizacion,
    tipoLugar: req.body.tipolugar,
    coordenadas: req.body.coordenadas,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
  });

  // Guardar lugar
  lugar
    .save(lugar)
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

// Devolver todas los lugares de la base de datos
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Lugar.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Se ha producido un error al recuperar las actividades.",
      });
    });
};

// Buscar un lugar por el nombre
exports.findOne = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Lugar.findOne(condition)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({
            message: "No se ha encontrado un lugar con el nombre" + nombre,
          });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message: "Error al recuperar al lugar con el nombre= " + nombre,
        });
    });
};

//busca lugar por localizacion

exports.buscaPorlocalizacion = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "¡Los datos a actualizar no pueden estar vacíos!",
    });
  }
  const id = req.params.id;
  let condition = Lugar.where({ localizacion: id });

  Lugar.find(condition)
    .populate("localizacion")
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({
            message:
              "No se ha encontrado un lugar en la localización  con id= " + id,
          });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error al recuperar el evento" });
    });
};

//busca lugar por tipo

exports.buscaPorTipos = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "¡Los datos a actualizar no pueden estar vacíos!",
    });
  }
  const id = req.params.id;
  let condition = Lugar.where({ tipoLugar: id });

  Lugar.find(condition)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({
            message: "No se ha encontrado un lugar con el tipo con id= " + id,
          });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error al recuperar el evento" });
    });
};

// Modificar un lugar, recuperandolo por el nombre
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

  Lugar.updateOne(condition, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se puede actualizar el lugar con nombre= ${nombre}. ¡Tal vez no se encontró!`,
        });
      } else
        res.send({
          message: `El lugar ${nombre} se ha actualizado con éxito.`,
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al actualizar el lugar con nombre= " + nombre,
      });
    });
};

// Borrar un lugar, recuperándolo por el nombre

exports.delete = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Lugar.findOneAndRemove(condition)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se ha podido eliminar el lugar con nombre=${nombre}. ¡Tal vez no se encontró!`,
        });
      } else {
        res.send({
          message: "¡Lugar eliminado con éxito!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se puede borrar el lugar con nombre=" + nombre,
      });
    });
};

// Borrar todas los lugares de la base de datos
exports.deleteAll = (req, res) => {
  Lugar.deleteMany({})
    .then((data) => {
      res.send({
        message: ` ¡Los lugares se han eliminado correctamente!, en total se borraron ${data.deletedCount}`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar los lugares.",
      });
    });
};
