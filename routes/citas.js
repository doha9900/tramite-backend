/*
    Citas
    ruta: '/api/cita'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getCitas,
    crearCita,
    actualizarCita,
    borrarCita,
    getCitaById
} = require('../controllers/citas')


const router = Router();

router.get( '/', validarJWT, getCitas );

router.post( '/',
    [
        validarJWT,
        check('paciente','El nombre del paciente es necesario').not().isEmpty(),
        check('hospital','El hospital id debe de ser válido').isMongoId(),
        validarCampos
    ], 
    crearCita 
);

router.put( '/:id',
    [
        validarJWT,
        check('paciente','El nombre del paciente es necesario').not().isEmpty(),
        check('hospital','El hospital id debe de ser válido').isMongoId(),
        validarCampos
    ],
    actualizarCita
);

router.delete( '/:id',
    validarJWT,
    borrarCita
);

router.get( '/:id',
    validarJWT,
    getCitaById
);



module.exports = router;



