const { response } = require('express');

const Transporte = require('../models/transporte');

const gettransportes = async(req, res = response) => {

    const transportes = await Transporte.find()
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img')
                                .populate('medico','nombre img')

    res.json({
        ok: true,
        transportes
    })
}

const getCitaById = async(req, res = response) => {

    const id = req.params.id;

    try {
        const cita = await Transporte.findById(id)
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img')
                                .populate('medico','nombre img');
    
        res.json({
            ok: true,
            cita
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }
}

const crearCita = async (req, res = response) => {
    const uid = req.uid;
    const cita = new Transporte({
        usuario: uid,
        ...req.body
    });
    try {

        const citaDB = await cita.save();

        
        res.json({
            ok: true,
            cita: citaDB
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error
        })
    }
}

const actualizarCita = async(req, res = response) => {
    const id  = req.params.id;
    const uid = req.uid;
    try {
        const cita = await Transporte.findById( id );
        if ( !cita ) {
            return res.status(404).json({
                ok: true,
                msg: 'Transporte no encontrada por id',
            });
        }
        const cambiosCita = {
            ...req.body,
            usuario: uid
        }
        const citaActualizado = await Transporte.findByIdAndUpdate( id, cambiosCita, { new: true } );
        res.json({
            ok: true,
            cita: citaActualizado
        })
    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const borrarCita = async (req, res = response) => {
   
    const id  = req.params.id;

    try {
        
        const cita = await Transporte.findById( id );

        if ( !cita ) {
            return res.status(404).json({
                ok: true,
                msg: 'Transporte no encontrada por id',
            });
        }

        await Transporte.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Transporte borrada'
        }); 

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}



module.exports = {
    gettransportes,
    crearCita,
    actualizarCita,
    borrarCita,
    getCitaById
}