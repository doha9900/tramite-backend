const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    DNI: {
        type: String,
        required: true
    },
    RUC: {
        type: String,
        required: true,
    },
    sexo: {
        type: String,
        required: true,
        default: 'H'
    },
    lugar_capacitacion: {
        type: String,
        required: true,
        default: 'centro'
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    }
}, { versionKey: false });


module.exports = model( 'Usuario', UsuarioSchema );
