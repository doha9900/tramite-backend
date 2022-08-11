const { Schema, model } = require('mongoose');

const ActaSchema = Schema({
    ubicación: {
        type: String,
        required: true
    },
    transporte: {
        type: Schema.Types.ObjectId,
        ref: 'Transporte',
        required: true
    },
    control: {
        type: Boolean,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
}, { versionKey: false });


module.exports = model( 'Acta', ActaSchema );
