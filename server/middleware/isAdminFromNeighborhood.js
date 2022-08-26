const mongoose = require('mongoose');
const { Neighborhood } = require('../models/neighborhood');

//Chequea que el que hace el request sea un usuario admin del grupo de vecinos en cuestion
module.exports = async function (req, res, next) {
  const { user } = req;
  var { neighborhood } = req.body;

  if (!user || !neighborhood)
    return res
      .status(403)
      .send('Acceso denegado. No se encontró el usuario o el vecino');
  if (!user.admin) return res.status(403).send('Acceso denegado.');
  const _id = mongoose.Types.ObjectId.isValid(neighborhood)
    ? neighborhood
    : undefined;

  neighborhood = await Neighborhood.findOne({
    $or: [{ name: neighborhood }, { _id }]
  });

  if (!neighborhood) return res.status(401).send("Neighborhood doesn't exist");

  var appears = user.admin.neighborhoods.some((elem) => {
    return elem.toString() === neighborhood._id.toString();
  });

  if (!appears) {
    return res
      .status(403)
      .send('No sos el admin de este grupo! Acción denegada');
  }

  req.adminId = user.admin;

  next();
};
