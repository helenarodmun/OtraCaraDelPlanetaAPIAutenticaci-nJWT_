module.exports = (mongoose) => {
  var tipoActividadSchema = new mongoose.Schema(
    {
      _id: mongoose.Schema.Types.ObjectId,
      nombre: String,
    },
    { timestamps: true },
    { collection: "tipoactividades" }
  );

  tipoActividadSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const TipoActividad = mongoose.model("tipoactividades", tipoActividadSchema);
  return TipoActividad;
};
