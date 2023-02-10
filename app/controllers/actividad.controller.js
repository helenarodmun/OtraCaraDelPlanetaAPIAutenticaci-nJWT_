const db = require("../models");
const Actividad = db.actividades;
const conf = require("../config/db.config");
const jwt = require("jsonwebtoken");
// Crear y guardar un nuevo usuario
exports.create = (req, res) => {


    // Si el token es válido, continuar con la creación de la actividad
    if (!req.body.nombre) {
      res.status(400).send({ message: "¡El contenido no puede estar vacío!" });
      return;
    }

    // Crear usuario
    const actividad = new Actividad({
      lugar: req.body.lugar,
      tipoActividad: req.body.tipoActividad,
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      contacto: req.body.contacto,
      dias: req.body.dias,
      horario: req.body.horario,
      reserva: req.body.reserva,
      precio: req.body.precio,
      descripcion: req.body.descripcion,
    });

    // Guardar usuario
    actividad
      .save(actividad)
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

// Devolver todas las actividades de la base de datos
exports.findAll = (req, res) => {
  console.log('Antes de verificar el token');
  try {
    const decoded = jwt.verify(req.cookies.token, conf.TOKEN_SECRET);
    console.log(req.headers.token);

    const nombre = req.query.nombre;
    let condition = nombre
      ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
      : {};

    Actividad.find(condition)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Se ha producido un error al recuperar los usuarios.",
        });
      });
  } catch (err) {
    // Si el token es inválido, responder con un error
    res.status(401).send({ message: "Token inválido. Acceso denegado." });
  }
};


// Buscar una actividad por el nombre
exports.findOne = (req, res) => {
  const nombre = req.params.nombre;
  let condition = Actividad.where({ nombre: nombre });

  Actividad.findOne(condition)
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "No se ha encontrado una actividad con el nombre" + nombre,
        });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al recuperar la actividad con nombre= " + nombre,
      });
    });
};
//busca actividades por tipo de actividad

exports.buscaPorTipos = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "¡Los datos a actualizar no pueden estar vacíos!",
    });
  }
  const id = req.params.id;
  let condition = Actividad.where({ tipoActividad: id });

  Actividad.find(condition)
    .populate("tipoActividad")
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: "No se ha encontrado una actividad con el tipo" + id,
        });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error al recuperar la actividad" });
    });
};
//busca actividades por lugar

exports.buscaPorLugar = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "¡Los datos a actualizar no pueden estar vacíos!",
    });
  }
  const id = req.params.id;
  let condition = Actividad.where({ lugar: id });

  Actividad.find(condition)
    .populate("lugar")
    .then((data) => {
      if (!data)
        res.status(404).send({
          message:
            "No se ha encontrado una actividad en el lugar con id= " + id,
        });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error al recuperar la actividad" });
    });
};

// Modificar un usuario, recuperandolo por el nombre
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

  Actividad.updateOne(condition, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se puede actualizar la actividad con nombre=${nombre}. ¡Tal vez no se encontró el usuario!`,
        });
      } else res.send({ message: "La actividad se ha actualizado con éxito." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al actualizar la actividad con nombre=" + nombre,
      });
    });
};

// Borrar una actividad por nombre
exports.delete = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Actividad.findOneAndRemove(condition)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se ha podido eliminar la actividad con nombre=${nombre}. ¡Tal vez no se encontró!`,
        });
      } else {
        res.send({
          message: "¡Actvidad eliminada con éxito!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se puede borrar la actividad con nombre=" + nombre,
      });
    });
};

// Borrar todas las avctividades de la base de datos
exports.deleteAll = (req, res) => {
  Actividad.deleteMany({})
    .then((data) => {
      res.send({
        message: ` ¡Las actividades se han eliminado correctamente!, en total se borraron ${data.deletedCount}`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar las actividades.",
      });
    });
};
