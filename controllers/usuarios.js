const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const axios = require("axios");

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre email role google img").skip(desde).limit(100),
    Usuario.countDocuments(),
  ]);

  res.json({
    ok: true,
    usuarios,
    total,
  });
};

const miUsuarioDetalles = async (req, res) => {
  const id = req.params.id;
  const me = await Usuario.findById(id);
  res.json({
    ok: true,
    usuario: me,
  });
};

const miUsuarioRENIECApi = async (req, res) => {
  const id = req.params.id;
  const me = await Usuario.findById(id);
  axios.defaults.headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.APIS_NET_TOKEN,
  };
  axios
    .get("https://api.apis.net.pe/v1/dni?numero=" + me.DNI)
    .then(async function (response) {
      res.json({
        ok: true,
        message: response.data,
      });
    })
    .catch(function (error) {
      // handle error
      console.log("No se encontraron resultados", error);
      res.json({
        ok: false,
        message: "DNI Inválido o no se encontraron resultados.",
      });
    });
};

const miUsuarioSUNATApi = async (req, res) => {
  const id = req.params.id;
  const me = await Usuario.findById(id);
  axios.defaults.headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.APIS_NET_TOKEN,
  };
  axios
    .get("https://api.apis.net.pe/v1/ruc?numero=" + me.RUC)
    .then(async function (response) {
      res.json({
        ok: true,
        message: response.data,
      });
    })
    .catch(function (error) {
      // handle error
      console.log("No se encontraron resultados", error);
      res.json({
        ok: false,
        message: "RUC Inválido o no se encontraron resultados.",
      });
    });
};

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }

    const usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar usuario
    await usuario.save();

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el usuario correcto

  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    // Actualizaciones
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }

    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario de google no pueden cambiar su correo",
      });
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: "Usuario eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getUsuarios,
  miUsuarioDetalles,
  miUsuarioRENIECApi,
  miUsuarioSUNATApi,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
};
