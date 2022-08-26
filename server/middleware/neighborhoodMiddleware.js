const mongoose = require('mongoose');
const { Neighborhood } = require('../models/neighborhood');
const Joi = require('joi');

const validateNeigbhorhoodCreation = async (req, res, next) => {
  const { address, neighborhood } = req.body;

  var neighExists = await Neighborhood.findOne({
    name: neighborhood
  });

  const { error } = validateAddressSchema(address);
  if (error) {
    return res.status(400).send('Ingrese una dirección valida');
  }

  if (neighExists)
    return res.status(409).send('Ya existe un grupo con ese nombre');

  neighExists = await Neighborhood.findOne({
    address
  });

  if (neighExists)
    return res.status(409).send('Ya existe un grupo con esa dirección');

  next();
};

const validateLeaveNeighborhoodAsAdmin = async (req, res, next) => {
  const { adminId, neighborhood } = req.body;

  if (!neighborhood || !adminId) return res.status(401).send();

  const neigh = await Neighborhood.findOne({
    $or: [{ name: neighborhood }, { _id: neighborhood }]
  });

  if (
    neigh.admins.includes(mongoose.Types.ObjectId(adminId)) &&
    neigh.admins.length === 1
  )
    return res
      .status(404)
      .send(
        'No puede abandonar el grupo ya que es el último administrador del mismo'
      );

  req.body.neighborhood = neigh._id;
  req.params.neighborhood = neigh._id;

  next();
};

function validateAddressSchema(address) {
  const schema = Joi.object({
    lat: Joi.any(),
    lng: Joi.any(),
    address: Joi.string().required(),
    administrative_area_level_2: Joi.string().required()
  });

  return schema.validate(address);
}

const nameToNeighborhood = (req, res, next) => {
  req.body.neighborhood = req.body.name;
  next();
};

module.exports = {
  validateNeigbhorhoodCreation,
  validateLeaveNeighborhoodAsAdmin,
  nameToNeighborhood
};
