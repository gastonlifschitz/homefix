const { Neighborhood } = require('../models/neighborhood');

const createAdminValidateRequest = async (req, res, next) => {
  const { neighborhoodName, join: shouldJoin } = req.body;

  var neighborhood = await Neighborhood.findOne({ name: neighborhoodName });

  //If i want to join one and it doesnt exist, then exit
  if (!neighborhood && shouldJoin)
    return res.status(400).send('El grupo no existe');

  //If i want to create one and it does exist, then exit
  if (neighborhood && !shouldJoin)
    return res.status(400).send('El grupo ya existe');

  next();
};

module.exports = {
  createAdminValidateRequest
};
