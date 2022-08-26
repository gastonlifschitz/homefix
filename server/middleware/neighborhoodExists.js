const { Neighborhood } = require('../models/neighborhood');

//Chequea que el neighborhood exista
//Nos manejamos con
module.exports = async function (req, res, next) {
  var { neighborhood } = req.body;
  if (!neighborhood)
    return res.status(403).send('El nombre del grupo es necesario');

  neighborhood = await Neighborhood.findOne({
    name: neighborhood
  });
  if (!neighborhood) return res.status(409).send('El grupo no existe');

  req.targetNeighborhood = neighborhood;

  next();
};
