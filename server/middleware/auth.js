const jwt = require('jsonwebtoken');
const config = require('config');

//Chequea que el que hace el request sea un usuario autenticado
module.exports = function (req, res, next) {
  if (!config.get('requiresAuth')) return next();

  const token = req.header('pf-token');

  if (!token)
    return res.status(401).send('Acceso denegado. No se encontró el token.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Token inválido');
  }
};
