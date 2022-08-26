const config = require('config');

//Chequea que el que hace el request sea un usuario admin
module.exports = function (req, res, next) {
  const { user } = req;

  if (!user)
    return res.status(401).send('Acceso denegado. No se encontró el usuario.');

  if (!user.employee) return res.status(403).send('Acceso denegado.');

  req.employeeId = user.employee;

  next();
};
