module.exports = (mongoose) => {
  var lugarSchema = new mongoose.Schema(
    {
      _id: mongoose.Schema.Types.ObjectId,
      localizacion: {
        type: mongoose.Schema.ObjectId,
        ref: "localizaciones",
      },
      tipoLugar: {
        type: mongoose.Schema.ObjectId,
        ref: "tipolugares",
      },
      coordenadas: String,
      nombre: String,
      descripcion: String,
    },
    { timestamps: true },
    { collection: "lugares" }
  );

  lugarSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Lugar = mongoose.model("lugares", lugarSchema);
  return Lugar;
};
