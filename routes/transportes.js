/*
    Transportes
    ruta: '/api/Transporte'
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const {
  getTransportes,
  crearTransporte,
  actualizarTransporte,
  borrarTransporte,
  getTransporteById,
  getTransporteFromPlacaAPI,
} = require("../controllers/transportes");

const router = Router();

router.get("/", validarJWT, getTransportes);

router.get("/placa/:id", validarJWT, getTransporteFromPlacaAPI);

router.post("/", [validarCampos], crearTransporte);

router.put("/:id", [validarJWT, validarCampos], actualizarTransporte);

router.delete("/:id", validarJWT, borrarTransporte);

router.get("/:id", validarJWT, getTransporteById);

module.exports = router;
