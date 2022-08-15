const { response } = require("express");

const Transporte = require("../models/transporte");
const axios = require("axios");
const xmlParser = require("xml2json");

const getTransportes = async (req, res = response) => {
  const transportes = await Transporte.find().populate("usuario");
  res.json({
    ok: true,
    transportes,
  });
};

const getTransporteById = async (req, res = response) => {
  const id = req.params.id;

  try {
    const transporte = await Transporte.findById(id).populate("usuario");

    res.json({
      ok: true,
      transporte,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: true,
      msg: "Hable con el administrador",
    });
  }
};

const getTransporteFromPlacaAPI = async (req, res = response) => {
  const num_placa = req.params.num_placa;

  try {
    axios
      .get(
        `https://www.placaapi.pe/api/reg.asmx/CheckPeru?RegistrationNumber=${num_placa}&username=${process.env.NICKNAME}`
      )
      .then(async function (response) {
        let data = JSON.parse(
          JSON.parse(xmlParser.toJson(response.data)).Vehicle.vehicleJson
        );
        res.json({
          ok: true,
          message: {
            Description: data.Description,
            RegistrationYear: data.RegistrationYear,
            DeliveryPoint: data.DeliveryPoint,
            VIN: data.VIN,
            Make: data.Make,
            Model: data.Model,
            Owner: data.Owner,
            Use: data.Use,
            ImageUrl: data.ImageUrl,
          },
        });
      })
      .catch(function (error) {
        // handle error
        console.log("No se encontraron resultados", error);
        res.json({
          ok: false,
          message: "Num de placa inválido o no se encontraron resultados.",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

const crearTransporte = async (req, res = response) => {
  const uid = req.body.user_id;
  const transporte = new Transporte({
    usuario: uid,
    ...req.body,
  });
  try {
    const TransporteDB = await transporte.save();

    res.json({
      ok: true,
      Transporte: TransporteDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: error,
    });
  }
};

const actualizarTransporte = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.body.user_id;
  try {
    const transporte = await Transporte.findById(id);
    if (!transporte) {
      return res.status(404).json({
        ok: true,
        msg: "Transporte no encontrada por id",
      });
    }
    const cambiosTransporte = {
      ...req.body,
      usuario: uid,
    };
    const TransporteActualizado = await Transporte.findByIdAndUpdate(
      id,
      cambiosTransporte,
      { new: true }
    );
    res.json({
      ok: true,
      transporte: TransporteActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarTransporte = async (req, res = response) => {
  const id = req.params.id;

  try {
    const transporte = await Transporte.findById(id);

    if (!transporte) {
      return res.status(404).json({
        ok: true,
        msg: "Transporte no encontrada por id",
      });
    }

    await Transporte.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Transporte borrada",
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
  getTransportes,
  getTransporteFromPlacaAPI,
  crearTransporte,
  actualizarTransporte,
  borrarTransporte,
  getTransporteById,
};
