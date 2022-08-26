const { Neighborhood } = require('../models/neighborhood');
const { Neighbour } = require('../models/neighbour');
const mongoose = require('mongoose');

const validateIsSameNeighbour = (req, res, next) => {
  const { id } = req.params;
  const { user } = req;

  if (!id)
    return res.status(401).send('Acceso denegado. No se encontró el usuario.');

  if (user.neighbour && user.neighbour._id.toString() === id) {
    return next();
  }

  return res.status(403).send('Acceso denegado.');
};

const neighbourAlreadyInNeighborhood = async (req, res, next) => {
  let { admin, neighbour } = req.user;
  let { neighborhood, role } = req.body;
  const barrio = await Neighborhood.findOne({ name: neighborhood });

  if (
    neighbour.neighborhoods.some(
      (e) => JSON.stringify(e) === JSON.stringify(barrio._id)
    )
  ) {
    return res.status(400).send('El vecino ya se encuentra en el grupo');
  }
  next();
};

module.exports = {
  validateIsSameNeighbour,
  neighbourAlreadyInNeighborhood
};
