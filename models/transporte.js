const { Schema, model } = require("mongoose");

const TransporteSchema = Schema(
  {
    numero_placa: {
      type: String,
      required: true,
    },
    flota_vehicular: {
      type: String,
      required: true,
    }, // pasajero, carga, mercancia
    paradero: {
      type: String,
      requred: true,
    }, // terminal, paradero
    ruta: {
      type: String,
      requred: true,
    }, // nacional, internacional
    usuario: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { versionKey: false }
);

module.exports = model("Transporte", TransporteSchema);
