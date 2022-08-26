const { User } = require('../models/user');

//Chequea que el email exista, por ende existe ese usuario (puede ser de cualquier tipo)
module.exports = async function (req, res, next) {
  const { email } = req.body;

  if (!email) return res.status(403).send('Ingrese un email.');

  var user = await User.findOne({ email });

  if (!user) return res.status(403).json({ accountDoesntExists: true });

  req.targetUser = user;

  next();
};
