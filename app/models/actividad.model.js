module.exports = (mongoose) => {
  var actividadSchema = new mongoose.Schema(
    {
      lugar: {
        type: mongoose.Schema.ObjectId,
        ref: "lugares",
      },
      tipoActividad: {
        type: mongoose.Schema.ObjectId,
        ref: "tipoactividades",
      },
      nombre: String,
      direccion: String,
      contacto: String,
      dias: String,
      horario: String,
      reserva: Boolean,
      precio: String,
      descripcion: String,
    },
    { timestamps: true },
    { collection: "actividades" }
  );

  actividadSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Actividad = mongoose.model("actividades", actividadSchema);
  return Actividad;
};
