const db = require("../models");
const Evento = db.eventos;

// Crear y guardar un nuevo evento
exports.create = (req, res) => {
  // Validar la petición
  if (!req.body.nombre) {
    res.status(400).send({ message: "¡El contenido no puede estar vacío!" });
    return;
  }

  // Crear evento
  const evento = new Evento({
    lugar: req.body.lugar,
    tipoActividad: req.body.tipoActividad,
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    contacto: req.body.contacto,
    fecha: req.body.fecha,
    horario: req.body.horario,
    reserva: req.body.reserva,
    precio: req.body.precio,
    descripcion: req.body.descripcion,
  });

  // Guardar actividad
  evento
    .save(evento)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Ha ocurrido un error mientras intentaba crear wl evento.",
      });
    });
};

// Devolver todas los eventos de la base de datos
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Evento.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Se ha producido un error al recuperar los eventos.",
      });
    });
};

// Buscar un evento por el nombre
exports.findOne = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Evento.findOne(condition)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({
            message: "No se ha encontrado un evento con el nombre" + nombre,
          });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message: "Error al recuperar el evento con el nombre= " + nombre,
        });
    });
};

//busca evento por tipo de actividad

exports.buscaPorTipos = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "¡Los datos a actualizar no pueden estar vacíos!",
    });
  }
  const id = req.params.id;
  let condition = Evento.where({ tipoActividad: id });

  Evento.find(condition)
    .populate("tipoActividad")
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "No se ha encontrado un evento con el tipo" + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error al recuperar los eventos" });
    });
};
//busca evento por lugar

exports.buscaPorLugar = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "¡Los datos a actualizar no pueden estar vacíos!",
    });
  }
  const id = req.params.id;
  let condition = Evento.where({ lugar: id });

  Evento.find(condition)
    .populate("lugar")
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({
            message: "No se ha encontrado un evento en el lugar con id= " + id,
          });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error al recuperar el evento" });
    });
};

// Modificar un evento, recuperandolo por el nombre
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

  Evento.updateOne(condition, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se puede actualizar el evento con nombre=${nombre}. ¡Tal vez no se encontró el evento!`,
        });
      } else res.send({ message: "El evento se ha actualizado con éxito." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al actualizar el evento con nombre=" + nombre,
      });
    });
};

// Borrar un evento, recuperándolo por el nombre

exports.delete = (req, res) => {
  const nombre = req.params.nombre;
  var condition = nombre
    ? { nombre: { $regex: new RegExp(nombre), $options: "i" } }
    : {};

  Evento.findOneAndRemove(condition)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `No se ha podido eliminar el evento con nombre=${nombre}. ¡Tal vez no se encontró!`,
        });
      } else {
        res.send({
          message: "¡Evento eliminado con éxito!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "No se puede borrar el evento con nombre=" + nombre,
      });
    });
};

// Borrar todas las avctividades de la base de datos
exports.deleteAll = (req, res) => {
  Evento.deleteMany({})
    .then((data) => {
      res.send({
        message: ` ¡Los eventos se han eliminado correctamente!, en total se borraron ${data.deletedCount}`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar los eventos.",
      });
    });
};
