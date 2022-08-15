/*
    Ruta: /api/usuarios
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  getUsuarios,
  miUsuarioDetalles,
  miUsuarioRENIECApi,
  miUsuarioSUNATApi,
  miUsuarioRENIECApiPorDNI,
  miUsuarioSUNATApiPorRUC,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
} = require("../controllers/usuarios");
const {
  validarJWT,
  varlidarADMIN_ROLE,
  varlidarADMIN_ROLE_o_MismoUsuario,
} = require("../middlewares/validar-jwt");

const router = Router();

router.get("/", validarJWT, getUsuarios);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  crearUsuario
);

router.get("/me/:id", [validarJWT], miUsuarioDetalles);

router.get("/sunat/:id", [validarJWT], miUsuarioSUNATApi);

router.get("/reniec/:id", [validarJWT], miUsuarioRENIECApi);

router.get("/reniec/dni/:dni", [validarJWT], miUsuarioRENIECApiPorDNI);

router.get("/sunat/ruc/:ruc", [validarJWT], miUsuarioSUNATApiPorRUC);

router.put(
  "/:id",
  [
    validarJWT,
    varlidarADMIN_ROLE_o_MismoUsuario,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    // check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

router.delete("/:id", [validarJWT, varlidarADMIN_ROLE], borrarUsuario);

module.exports = router;
