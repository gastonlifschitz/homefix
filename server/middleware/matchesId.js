//el que hace el request soy yo mismo
module.exports = function (req, res, next) {
  const { user } = req;
  const { _id, admin, neighbour, employee } = user;
  const { id } = req.params;

  if (!user || !_id || !id) return res.status(401).send('Necesita un id');

  if (id === admin || id === employee || id === neighbour || id === _id) next();
  else res.status(400).send('No sos este usuario');
};
