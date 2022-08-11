const { Schema, model } = require('mongoose');

const TransporteSchema = Schema({
    numero_placa: {
        type: String,
        required: true
    },
    flota_vehicular: {
        type: String,
        required: true
    },
    paradero: {
        type: String,
        requred: true
    },
    ruta: {
        type: String,
        requred: true
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { versionKey: false });



module.exports = model( 'Transporte', TransporteSchema );
